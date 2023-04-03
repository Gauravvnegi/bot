import { Component, Input, OnInit } from '@angular/core';
import { RoomStatsImgUrls, sharedConfig } from '../../constants';

@Component({
  selector: 'hospitality-bot-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent implements OnInit {
  adminSharedConfig = sharedConfig;

  title: string;
  label: string;
  score: string;
  additionalData: string;
  comparisonPercent: number;
  imageUrls = RoomStatsImgUrls;
  tooltip: string;

  @Input() set stats(value) {
    this.title = value.label;
    this.label = value.label.replace(/([A-Z])/g, ' $1').trim();
    this.score = value.score;
    this.comparisonPercent = value.comparisonPercent || '';
    this.additionalData = value.additionalData || '';
    this.tooltip = value.tooltip;
  }

  constructor() {}

  ngOnInit(): void {}
}
