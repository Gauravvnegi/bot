import { Component, OnInit } from '@angular/core';
import { TableNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

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
