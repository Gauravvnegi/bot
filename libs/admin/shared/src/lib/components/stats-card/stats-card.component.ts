import { Component, Input, OnInit } from '@angular/core';
import { sharedConfig } from '../../constants';

type Stats = {
  title: string;
  score: string;
  comparisonStats: {
    score: string;
    isNegative: boolean;
    time: string;
  };
};

@Component({
  selector: 'hospitality-bot-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent implements OnInit {
  adminSharedConfig = sharedConfig;

  title: string;
  score: string;

  comparisonStats: {
    score: string;
    isNegative: string;
    time: string;
  };

  @Input() set stats(value) {
    this.title = value.title;
    this.score = value.score;
    this.comparisonStats = value.comparisonStats;
  }

  constructor() {}

  ngOnInit(): void {}
}
