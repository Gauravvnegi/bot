import { Component, OnInit, ComponentRef } from '@angular/core';
import { TableNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tables = TableNames;
  constructor() {
  }

  ngOnInit(): void {}
}
