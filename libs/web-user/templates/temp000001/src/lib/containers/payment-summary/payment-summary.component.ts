import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { PaymentSummary } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';

@Component({
  selector: 'hospitality-bot-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  paymentSummary: PaymentSummary;

  displayedColumns: string[] = [
    'label',
    'amount',
    'currency',
    'totalAmount',
  ];
  dataSource: any[] = [];
  
  constructor(
    private _paymentDetailsService : PaymentDetailsService
  ) {}

  ngOnInit(): void {
    this.paymentSummary = this.bookingSummary;
    this.getModifiedPaymentSummary();
  }

  applyPromocode(event) {
    console.log(event);
  }

  getModifiedPaymentSummary() {
    // let {
    //   label,
    //   description,
    //   amount,
    //   totalAmount,
    // } = this.paymentSummary.roomRates;

    // this.dataSource.push({
    //   label,
    //   description,
    //   amount,
    //   totalAmount,
    //   currency: this.paymentSummary.currencyCode,
    // });
    this.paymentSummary.packages.forEach((amenity) => {
      let {
        label,
        description,
        amount,
        totalAmount,
      } = amenity;

      this.dataSource.push({
        label,
        description,
        amount,
        totalAmount,
        currency: this.paymentSummary.currencyCode,
      });
    });
  }

  get bookingSummary(){
    return this._paymentDetailsService.paymentSummaryDetails.paymentSummary;
  }

  get currencyCode(){
    return this._paymentDetailsService.currencyCode;
  }

}
