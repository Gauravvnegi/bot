import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ConfigService,
  Option,
  Regex,
  UserService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { PaymentMethodList } from '../../../models/reservations.model';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'hospitality-bot-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: [
    './payment-method.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class PaymentMethodComponent implements OnInit {
  currencies: Option[] = [];
  paymentOptions: Option[] = [];
  entityId: string;

  $subscription = new Subscription();
  parentFormGroup: FormGroup;
  constructor(
    public fb: FormBuilder,
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    private userService: UserService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.addFormGroup();
    this.entityId = this.globalFilterService.entityId;
    this.getPaymentMethod();
    this.initConfig();

    const { firstName, lastName } = this.userService.userDetails;
    this.paymentControls.cashierFirstName.setValue(firstName);
    this.paymentControls.cashierLastName.setValue(lastName);

    // Set initial data for continue reservation after confirm booking.
    this.formService.initialData.next({
      ...this.formService.initialData.getValue(), // Get the current values
      cashierFirstName: firstName,
      cashierLastName: lastName,
    });
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;

    const data = {
      cashierFirstName: [{ value: '', disabled: true }],
      cashierLastName: [{ value: '', disabled: true }],
      totalPaidAmount: [
        0,
        [Validators.pattern(Regex.DECIMAL_REGEX), Validators.min(1)],
      ],
      currency: [''],
      paymentMethod: [''],
      paymentRemark: ['', [Validators.maxLength(60)]],
      transactionId: [''],
    };

    this.parentFormGroup.addControl('paymentMethod', this.fb.group(data));
  }

  initConfig() {
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { currencyConfiguration } = value;
        this.currencies = currencyConfiguration.map(({ key, value }) => ({
          label: key,
          value,
        }));
        this.controlContainer.control.get('paymentMethod').patchValue({
          currency: this.currencies[0].value,
        });

        // Set initial data for continue reservation after confirm booking.
        this.formService.initialData.next({
          ...this.formService.initialData.getValue(), // Get the current values
          currency: this.currencies[0].value,
        });
      }
    });
  }

  getPaymentMethod(): void {
    this.$subscription.add(
      this.manageReservationService.getPaymentMethod(this.entityId).subscribe(
        (response) => {
          const types = new PaymentMethodList()
            .deserialize(response)
            .records.map((item) => item.type);
          const labels = [].concat(
            ...types.map((array) => array.map((item) => item.label))
          );
          this.paymentOptions = labels.map((label) => ({
            label: label,
            value: label,
          }));
        },
        (error) => {}
      )
    );
  }

  get paymentControls() {
    return (this.parentFormGroup.get('paymentMethod') as FormGroup)
      .controls as Record<
      keyof ReservationForm['paymentMethod'],
      AbstractControl
    >;
  }
}
