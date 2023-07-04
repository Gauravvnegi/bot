import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import * as moment from 'moment';
import { ManageReservationService } from '../../../services/manage-reservation.service';

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
  constructor(
    public controlContainer: ControlContainer,
    private manageReservationService: ManageReservationService
  ) {}

  ngOnInit(): void {
    this.manageReservationService.reservationDate.subscribe((res) => {
      if (res) this.startMinDate = new Date(res);
    });
    this.registerPaymentRuleChange();
  }

  registerPaymentRuleChange() {
    this.startTime = moment(this.startMinDate).unix() * 1000;
    const deductedAmountControl = this.controlContainer.control.get(
      'paymentRule.deductedAmount'
    );
    const amountToPayControl = this.controlContainer.control.get(
      'paymentRule.amountToPay'
    );
    this.controlContainer.control
      .get('paymentRule.makePaymentBefore')
      .setValue(this.startTime);
    amountToPayControl.valueChanges.subscribe((res) => {
      const newDeductedAmount = this.deductedAmount - +res;
      deductedAmountControl.setValue(newDeductedAmount);
    });
  }
}
