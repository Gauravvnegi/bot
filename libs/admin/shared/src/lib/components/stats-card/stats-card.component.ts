import { Component, Input } from '@angular/core';
import { StatCardImageUrls, sharedConfig } from '../../constants';

@Component({
  selector: 'hospitality-bot-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent {
  adminSharedConfig = sharedConfig;

  title: string;
  label: string;
  score: string;
  additionalData: string;
  comparisonPercent: number;
  imageUrls = StatCardImageUrls;
  tooltip: string;

  @Input() set stats(value) {
    this.title = value?.title
      ? value?.title
      : value?.label?.replace(/\s+|-/g, '');
    this.label = value?.label;
    this.score = value?.score;
    this.comparisonPercent = value?.comparisonPercent || '';
    this.additionalData = value?.additionalData || '';
    this.tooltip = value?.tooltip;
  }

  getImageUrl(title: string): string {
    if (title) {
      return StatCardImageUrls[title];
    }
  }
}
