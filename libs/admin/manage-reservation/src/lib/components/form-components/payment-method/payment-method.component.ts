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
  ModuleNames,
  Option,
  UserService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { PaymentMethodList } from '../../../models/reservations.model';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ReservationForm } from '../../../constants/form';

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
  @Input() reservationId: string;
  $subscription = new Subscription();
  parentFormGroup: FormGroup;
  constructor(
    public fb: FormBuilder,
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    private userService: UserService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.addFormGroup();
    this.entityId = this.globalFilterService.entityId;
    this.getPaymentMethod();
    this.initConfig();

    const { firstName, lastName } = this.userService.userDetails;
    this.paymentControls.cashierFirstName.setValue(firstName);
    this.paymentControls.cashierLastName.setValue(lastName);
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;

    const data = {
      cashierFirstName: [{ value: '', disabled: true }],
      cashierLastName: [{ value: '', disabled: true }],
      totalPaidAmount: [0, [Validators.min(0)]],
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

  viewPaymentHistory() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TRANSACTIONS,
    });
  }

  get paymentControls() {
    return (this.parentFormGroup.get('paymentMethod') as FormGroup)
      .controls as Record<
      keyof ReservationForm['paymentMethod'],
      AbstractControl
    >;
  }

  get paymentRuleControls() {
    return (this.parentFormGroup.get('paymentRule') as FormGroup)
      .controls as Record<
      keyof ReservationForm['paymentRule'],
      AbstractControl
    >;
  }
}
