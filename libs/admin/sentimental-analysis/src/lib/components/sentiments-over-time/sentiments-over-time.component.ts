import { Component, OnInit } from '@angular/core';
import { SentimentalChart } from '../../constants/sentimental-chart';
import { colorConfig, MockData } from '../../constants/sentimental-mock-data';
import { SentimentOverTime } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-sentiments-over-time',
  templateUrl: './sentiments-over-time.component.html',
  styleUrls: ['./sentiments-over-time.component.scss'],
})
export class SentimentsOverTimeComponent implements OnInit {
  chartData = SentimentalChart.sentimentOverTime;
  graphData: SentimentOverTime;
  constructor() {}

  ngOnInit(): void {
    this.graphData = new SentimentOverTime().deserialize(
      MockData.sentimentsOverTime,
      colorConfig
    );
    this.initChartData();
  }

  initChartData(): void {
    this.chartData.labels = this.graphData.labels;
    this.chartData.datasets = [
      { data: [], label: 'Positive', fill: true },
      { data: [], label: 'Neutral', fill: true },
      { data: [], label: 'Negative', fill: true },
    ];
    this.chartData.colors = this.graphData.colors;
    this.graphData.stats.forEach((item) => {
      this.chartData.datasets[0].data.push(item.positive);
      this.chartData.datasets[1].data.push(item.neutral);
      this.chartData.datasets[2].data.push(item.negative);
    });
  }
}
