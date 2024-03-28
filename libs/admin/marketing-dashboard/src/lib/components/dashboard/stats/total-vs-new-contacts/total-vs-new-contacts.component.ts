import { Component, OnInit } from '@angular/core';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-total-vs-new-contacts',
  templateUrl: './total-vs-new-contacts.component.html',
  styleUrls: ['./total-vs-new-contacts.component.scss'],
})
export class TotalVsNewContactsComponent implements OnInit {
  labels: string[] = ['aa', 'bb', 'cc'];

  dataSets: DualPlotDataset[] = [
    {
      data: [1, 0, 0],
      fill: true,
      label: 'new',
      backgroundColor: '#A5D0FA',
      borderColor: '#4BA0F5',
      pointBackgroundColor: '#4BA0F5',
    },
    {
      data: [1, 0, 1],
      fill: true,
      label: 'total',
      backgroundColor: '#A9D99F',
      borderColor: '#52B33F',
      pointBackgroundColor: '#52B33F',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
