import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { PaymentDetail } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';

@Component({
  selector: 'hospitality-bot-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  paymentSummary: PaymentDetail[];
  totalAmount = 0;
  currency: string;
  
  constructor(
    private _paymentDetailsService : PaymentDetailsService
  ) {}

  ngOnInit(): void {
    this.paymentSummary = this.bookingSummary;
    this.currency = this.currencyCode;
    this.calculateTotalAmount();
  }

  calculateTotalAmount(){
    this.paymentSummary.forEach((payment) => {
      this.totalAmount += payment.totalRate;
    })
  }

  get bookingSummary(){
    return this._paymentDetailsService.paymentSummaryDetails.paymentDetail;
  }

  get currencyCode(){
    return this._paymentDetailsService.paymentSummaryDetails.currencyCode;
  }

}
