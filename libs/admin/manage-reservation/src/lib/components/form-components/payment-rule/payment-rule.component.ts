import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import * as moment from 'moment';
import { ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-payment-rule',
  templateUrl: './payment-rule.component.html',
  styleUrls: ['./payment-rule.component.scss', '../../reservation.styles.scss'],
})
export class PaymentRuleComponent implements OnInit {
  startMinDate = new Date();
  startTime: number;
  viewAmountToPay = false;
  parentFormGroup: FormGroup;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.$subscription.add(
      this.formService.reservationDate.subscribe((res) => {
        if (res) this.startMinDate = new Date(res);
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
    };
    this.parentFormGroup.addControl('paymentRule', this.fb.group(data));
  }

  registerPaymentRuleChange() {
    this.startTime = moment(this.startMinDate).unix() * 1000;
    this.inputControl.makePaymentBefore.setValue(this.startTime);

    this.inputControl.amountToPay.valueChanges.subscribe((res) => {
      const newDeductedAmount = this.inputControl.deductedAmount.value - +res;
      debugger;
      this.inputControl.deductedAmount.setValue(newDeductedAmount);
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
}
