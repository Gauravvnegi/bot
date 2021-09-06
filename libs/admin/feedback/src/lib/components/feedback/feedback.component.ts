import { Component, OnInit } from '@angular/core';
import {
  CardNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  public cards = CardNames;
  tables = TableNames;

  tabFilterIdx = 0;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }
}
