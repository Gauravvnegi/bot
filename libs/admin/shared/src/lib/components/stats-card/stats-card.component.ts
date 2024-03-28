import { Component, Input } from '@angular/core';
import { StatCardImageUrls, sharedConfig } from '../../constants';
import { StatCard } from '../../types/chart.type';

@Component({
  selector: 'hospitality-bot-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent {
  adminSharedConfig = sharedConfig;

  key: string;
  label: string;
  score: string | number;
  additionalData: string | number;
  comparisonPercent: number;
  imageUrls = StatCardImageUrls;
  tooltip: string;

  @Input() isComparisonPercent: boolean = false;

  @Input() set stats(value: StatCard) {
    this.key = value?.key ? value?.key : value?.label?.replace(/\s+|-/g, '');
    this.label = value?.label;
    this.score = value?.score;
    this.comparisonPercent = value?.comparisonPercent || 0;
    this.additionalData = value?.additionalData || '';
    this.tooltip = value?.tooltip;
  }

  getImageUrl(key: string): string {
    if (key) {
      return StatCardImageUrls[key];
    }
  }
}
