import { Component, OnInit } from '@angular/core';
import { config } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  config = config;
  data = [
    { today: 59, yesterday: 31, comparisonPercent: 47, label: 'Sent' },
    { today: 57, yesterday: 31, comparisonPercent: 46, label: 'Delivered' },
    { today: 41, yesterday: 22, comparisonPercent: 46, label: 'Read' },
    { today: 3, yesterday: 0, comparisonPercent: 100, label: 'Failed' },
  ];
  total = 59;
  constructor() {}

  ngOnInit(): void {}

  progressValue(data) {
    return Math.floor((data.today / this.total) * 100);
  }
}
