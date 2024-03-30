import { Component, OnInit } from '@angular/core';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-subscribe-vs-unsubscribe',
  templateUrl: './subscribe-vs-unsubscribe.component.html',
  styleUrls: ['./subscribe-vs-unsubscribe.component.scss'],
})
export class SubscribeVsUnsubscribeComponent implements OnInit {
  constructor() {}

  labels: string[] = ['aa', 'bb', 'cc'];

  dataSets: DualPlotDataset[] = [
    {
      data: [1, 0, 0],
      fill: true,
      label: 'Subscribed',
      backgroundColor: '#f2c0ca',
      borderColor: '#CC052B',
      pointBackgroundColor: '#CC052B',
    },
    {
      data: [1, 0, 1],
      fill: true,
      label: 'Unsubscribed',
      backgroundColor: '#A9D99F',
      borderColor: '#52B33F',
      pointBackgroundColor: '#52B33F',
    },
  ];

  ngOnInit(): void {}
}
