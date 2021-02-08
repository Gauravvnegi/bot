import { Component, OnInit } from '@angular/core';
import { FeedbackDistribution } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit {
  chart: any = {
    Labels: [
      'Very Poor',
      'Poor',
      'Adequate',
      'Good',
      'Very Good',
      'OutStanding',
    ],
    Data: [[]],
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: [
          '#CC052B',
          '#EF1D45',
          '#FF8F00',
          '#4BA0F5',
          '#224BD5',
          '#508919',
        ],
        borderColor: [
          '#CC052B',
          '#EF1D45',
          '#FF8F00',
          '#4BA0F5',
          '#224BD5',
          '#508919',
        ],
      },
    ],
    Options: {
      responsive: true,
      cutoutPercentage: 80,
    },
  };

  distribution = new FeedbackDistribution().deserialize({
    totalCount: 538,
    veryPoor: 60,
    poor: 60,
    adequate: 180,
    good: 84,
    veryGood: 84,
    outstanding: 70
  });
  constructor() {}

  ngOnInit(): void {
    this.initChartData();
  }

  initChartData(): void {
    this.chart.Data[0] = [];
    Object.keys(this.distribution.percentage).forEach((key) => {
      this.chart.Data[0].push(this.distribution.percentage[key]);
    })
  }
}
