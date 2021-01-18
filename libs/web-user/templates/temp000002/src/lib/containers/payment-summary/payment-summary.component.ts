import { Component, OnInit } from '@angular/core';
import { PaymentSummaryComponent as BasePaymentSummaryComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/payment-summary/payment-summary.component';
@Component({
  selector: 'hospitality-bot-payment-summary',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/payment-summary/payment-summary.component.html',
  styleUrls: ['./payment-summary.component.scss'],
})
export class PaymentSummaryComponent extends BasePaymentSummaryComponent {}
