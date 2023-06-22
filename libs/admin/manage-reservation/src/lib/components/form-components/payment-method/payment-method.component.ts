import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: [
    './payment-method.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class PaymentMethodComponent implements OnInit {
  @Input() paymentOptions: Option[] = [];
  @Input() currencies: Option[] = [];

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
