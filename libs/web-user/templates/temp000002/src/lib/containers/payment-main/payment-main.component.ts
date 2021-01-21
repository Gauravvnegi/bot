import { Component, OnInit } from '@angular/core';
import { PaymentMainComponent as BasePaymentMainComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/payment-main/payment-main.component';

@Component({
  selector: 'hospitality-bot-payment-main',
  templateUrl: './payment-main.component.html',
  styleUrls: ['./payment-main.component.scss'],
})
export class PaymentMainComponent extends BasePaymentMainComponent {}
