import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { PaymentSummary } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { JOURNEY } from 'libs/web-user/shared/src/lib/constants/journey';

@Component({
  selector: 'hospitality-bot-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss']
})
export class PaymentSummaryComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  paymentSummary: PaymentSummary;
  journey: string;

  displayedColumns = {
    columns:[
    'label',
    'amount',
    'currency',
    'totalAmount',
  ]};
  dataSource: any[] = [];
  
  constructor(
    private _paymentDetailsService : PaymentDetailsService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.paymentSummary = this.bookingSummary;
    this.journey = this.hotelService.currentJourney;
    this.initDataColumns();
  }

  initDataColumns(): void {
    if (this.journey === JOURNEY.checkout) {
      this.displayedColumns.columns = [
        'label',
        'unit',
        'base',
        'amount',
        'CGST',
        'SGST',
        'totalAmount',
      ];
      this.getModifiedCheckoutPaymentSummary();
    } else {
      this.displayedColumns.columns = [
        'label',
        'amount',
        'currency',
        'totalAmount',
      ];
      this.getModifiedPaymentSummary();
    }
  }

  applyPromocode(event) {
    console.log(event);
  }

  getModifiedCheckoutPaymentSummary(): void {
    let {
      label,
      description,
      unit,
      base,
      amount,
      totalAmount,
      taxAndFees,
    } = this.paymentSummary.roomRates;

    this.dataSource.push({
      label,
      description,
      unit,
      base,
      amount,
      totalAmount,
      currency: this.paymentSummary.currencyCode,
      ...Object.assign(
        {},
        ...taxAndFees.map((taxType) => ({
          [taxType.type]: taxType.value,
        }))
      ),
    });
    this.paymentSummary.packages.forEach((amenity) => {
      let {
        label,
        description,
        unit,
        base,
        amount,
        totalAmount,
        taxAndFees,
      } = amenity;

      this.dataSource.push({
        label,
        description,
        unit,
        base,
        amount,
        totalAmount,
        currency: this.paymentSummary.currencyCode,
        ...Object.assign(
          {},
          ...taxAndFees.map((taxType) => ({
            [taxType.type]: taxType.value,
          }))
        ),
      });
    }); 
  }

  getModifiedPaymentSummary() {
    if (this.paymentSummary.depositRules.label) {
      let { label, amount } = this.paymentSummary.depositRules;
      this.dataSource.push({
        label,
        description: '',
        amount,
        totalAmount: amount,
        currency: this.paymentSummary.currencyCode
      });
    }
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

  get roomRates() {
    return this.paymentSummary.roomRates;
  }

}
