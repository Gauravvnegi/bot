import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';
import { Subscription } from 'rxjs';
import { ReservationType } from '../../../constants/reservation-table';

@Component({
  selector: 'hospitality-bot-payment-rule',
  templateUrl: './payment-rule.component.html',
  styleUrls: ['./payment-rule.component.scss', '../../reservation.styles.scss'],
})
export class PaymentRuleComponent implements OnInit {
  currentDate = new Date();
  startTime: number;
  viewAmountToPay = false;
  parentFormGroup: FormGroup;
  totalAmount = 0;
  $subscription = new Subscription();
  minDate = new Date();
  maxDate = new Date();
  isConfirmedReservation: boolean = false;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.maxDate.setDate(this.currentDate.getDate());
    this.$subscription.add(
      this.formService.reservationDate.subscribe((res) => {
        if (res) {
          this.maxDate = new Date(res);
        }
      })
    );
    this.addFormGroup();
    this.registerPaymentRuleChange();
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;

    const data = {
      amountToPay: [0],
      deductedAmount: [''],
      makePaymentBefore: [''],
      inclusionsAndTerms: [''],
      type: ['FLAT'],
    };
    this.parentFormGroup.addControl('paymentRule', this.fb.group(data));
    this.formService.deductedAmount.subscribe((res) => {
      this.totalAmount = res;
    });
    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        this.isConfirmedReservation = res === ReservationType.CONFIRMED;
      }
    );
  }

  registerPaymentRuleChange() {
    this.inputControl.amountToPay.valueChanges.subscribe((res) => {
      if (!res) this.inputControl.deductedAmount.setValue(this.totalAmount);
      if (res && this.inputControl.amountToPay.valid) {
        const newDeductedAmount = this.totalAmount - +res;
        this.inputControl.deductedAmount.setValue(newDeductedAmount);
      }
    });
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get inputControl() {
    return (this.parentFormGroup.get('paymentRule') as FormGroup)
      .controls as Record<
      keyof ReservationForm['paymentRule'],
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.parentFormGroup.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }
}
