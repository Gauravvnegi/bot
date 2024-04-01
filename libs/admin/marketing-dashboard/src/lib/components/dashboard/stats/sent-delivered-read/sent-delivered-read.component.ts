import { Component, Input, OnInit } from '@angular/core';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';
import { EMarketStatsResponse } from '../../../types/campaign.response.type';
import {
  eMarketEmailStat,
  eMarketWhatsappStat,
} from '../../../../constants/emarket-stats.constants';

@Component({
  selector: 'hospitality-bot-sent-delivered-read',
  templateUrl: './sent-delivered-read.component.html',
  styleUrls: ['./sent-delivered-read.component.scss'],
})
export class SentDeliveredReadComponent implements OnInit {
  @Input() set data(value: EMarketStatsResponse) {
    if (value) {
      this.statData.forEach((stat) => {
        stat.data = Object.values(value[stat.id]);
      });
    }
  }

  statData: DualPlotDataset[];

  label: string = 'Sent Vs Delivered vs Read';

  @Input() set selectedTab(value: string) {
    if (value === 'EMAIL') {
      this.label = 'Delivered Vs Open Vs Click';
      this.statData = eMarketEmailStat;
    } else {
      this.label = 'Sent Vs Delivered Vs Read';
      this.statData = eMarketWhatsappStat;
    }
  }

  @Input() labels: string[] = [];

  ngOnInit(): void {}
}
