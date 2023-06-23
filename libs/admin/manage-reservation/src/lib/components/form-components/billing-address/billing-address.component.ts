import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: [
    './billing-address.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class BillingAddressComponent implements OnInit {
  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}
}
