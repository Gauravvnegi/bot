import { Component, OnInit } from '@angular/core';
import { SentimentalChart } from '../../constants/sentimental-chart';
import { MockData } from '../../constants/sentimental-mock-data';
import { SentimentsByRatings } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-sentiments-rating',
  templateUrl: './sentiments-rating.component.html',
  styleUrls: ['./sentiments-rating.component.scss'],
})
export class SentimentsRatingComponent implements OnInit {
  chart = SentimentalChart.stackedGraph;
  graphData: SentimentsByRatings;
  constructor() {}

  ngOnInit(): void {
    this.graphData = new SentimentsByRatings().deserialize(
      MockData.sentimentsByRatings
    );
    this.initChartData();
  }

  initChartData(): void {
    this.chart.labels = this.graphData.labels;
    this.chart.datasets = [
      { data: [], label: 'Positive', stack: 'a' },
      { data: [], label: 'Neutral', stack: 'a' },
      { data: [], label: 'Negative', stack: 'a' },
    ];
    this.graphData.stats.forEach((item) => {
      this.chart.datasets[0].data.push(item.positive);
      this.chart.datasets[1].data.push(item.neutral);
      this.chart.datasets[2].data.push(item.negative);
    });
  }
}
