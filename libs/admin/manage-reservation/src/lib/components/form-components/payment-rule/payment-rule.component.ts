import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'hospitality-bot-payment-rule',
  templateUrl: './payment-rule.component.html',
  styleUrls: ['./payment-rule.component.scss', '../../reservation.styles.scss'],
})
export class PaymentRuleComponent implements OnInit {
  startMinDate = new Date();
  startTime: number;
  viewAmountToPay = false;
  @Input() deductedAmount = 0;
  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.startTime = moment(this.startMinDate).unix() * 1000;
    this.registerPaymentRuleChange();
  }

  registerPaymentRuleChange() {
    const deductedAmountControl = this.controlContainer.control.get(
      'paymentRule.deductedAmount'
    );
    const amountToPayControl = this.controlContainer.control.get(
      'paymentRule.amountToPay'
    );
    amountToPayControl.valueChanges.subscribe((res) => {
      const newDeductedAmount = this.deductedAmount - +res;
      deductedAmountControl.setValue(newDeductedAmount);
    });
  }
}
