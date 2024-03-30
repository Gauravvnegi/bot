import { Component, Input, OnInit } from '@angular/core';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';
import { EMarketStatsResponse } from '../../../types/campaign.response.type';

@Component({
  selector: 'hospitality-bot-sent-delivered-read',
  templateUrl: './sent-delivered-read.component.html',
  styleUrls: ['./sent-delivered-read.component.scss'],
})
export class SentDeliveredReadComponent implements OnInit {
  @Input() set data(value: EMarketStatsResponse) {
    if (value) {
      this.sentDeliveredReadStatsData[0].data = Object.values(
        value.sentEventStats
      );
      this.sentDeliveredReadStatsData[1].data = Object.values(
        value.deliveredEventStats
      );

      this.sentDeliveredReadStatsData[2].data = Object.values(
        value.readEventStats
      );
    }
  }

  @Input() labels: string[] = [];

  ngOnInit(): void {}
  sentDeliveredReadStatsData: DualPlotDataset[] = [
    {
      data: [0],
      fill: true,
      label: 'sent',
      backgroundColor: '#4BA0F5',
      borderColor: '#4BA0F5',
      pointBackgroundColor: '#4BA0F5',
    },
    {
      data: [0],
      fill: true,
      label: 'Delivered',
      backgroundColor: '#FF9F40',
      borderColor: '#FF9F40',
      pointBackgroundColor: '#FF9F40',
    },
    {
      data: [0],
      fill: true,
      label: 'Read',
      backgroundColor: '#4BC0C0',
      borderColor: '#4BC0C0',
      pointBackgroundColor: '#4BC0C0',
    },
  ];
}
