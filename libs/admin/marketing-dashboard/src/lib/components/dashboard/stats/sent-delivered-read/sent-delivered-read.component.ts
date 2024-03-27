import { Component, OnInit } from '@angular/core';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-sent-delivered-read',
  templateUrl: './sent-delivered-read.component.html',
  styleUrls: ['./sent-delivered-read.component.scss'],
})
export class SentDeliveredReadComponent implements OnInit {
  constructor() {}
  labels: string[] = ['aa', 'bb', 'cc'];

  dataSets: DualPlotDataset[] = [
    {
      data: [5, 0, 0],
      fill: true,
      label: 'sent',
      backgroundColor: '#c9e6f9',
      borderColor: '#4BA0F5',
      pointBackgroundColor: '#4BA0F5',
    },
    {
      data: [10, 20, 15],
      fill: true,
      label: 'Delivered',
      backgroundColor: '#e0dfd9',
      borderColor: '#FF9F40',
      pointBackgroundColor: '#FF9F40',
    },
    {
      data: [20, 0, 45],
      fill: true,
      label: 'Read',
      backgroundColor: '#dceae2',
      borderColor: '#4BC0C0',
      pointBackgroundColor: '#4BC0C0',
    },
  ];

  ngOnInit(): void {}
}
