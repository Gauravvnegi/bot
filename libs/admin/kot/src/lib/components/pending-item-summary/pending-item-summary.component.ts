import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-pending-item-summary',
  templateUrl: './pending-item-summary.component.html',
  styleUrls: ['./pending-item-summary.component.scss'],
})
export class PendingItemSummaryComponent implements OnInit {
  @Input() itemPendingSummaryList: ItemPendingSummaryList[];

  constructor() {}

  ngOnInit(): void {}
}

type ItemPendingSummaryList = {
  name: string;
  isVeg: boolean;
  quantity: number;
};
