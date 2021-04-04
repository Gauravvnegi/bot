import { Component, OnInit } from '@angular/core';
import { TableNames } from 'libs/shared/constants/subscriptionConfig';
@Component({
  selector: 'hospitality-bot-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
})
export class GuestComponent implements OnInit {
  tables = TableNames;
  constructor() {}

  ngOnInit(): void {}
}
