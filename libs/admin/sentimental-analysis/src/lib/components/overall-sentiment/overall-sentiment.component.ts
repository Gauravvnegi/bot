import { Component, OnInit } from '@angular/core';
import { SentimentalChart } from '../../constants/sentimental-chart';
import { colorConfig, MockData } from '../../constants/sentimental-mock-data';
import { OverallSentiments } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-overall-sentiment',
  templateUrl: './overall-sentiment.component.html',
  styleUrls: ['./overall-sentiment.component.scss'],
})
export class OverallSentimentComponent implements OnInit {
  graphData = SentimentalChart.doughnutChart;
  data = MockData.overallSentiments;
  colors = colorConfig;
  sentimentData: OverallSentiments;
  constructor() {}

  ngOnInit(): void {
    this.sentimentData = new OverallSentiments().deserialize(
      MockData.overallSentiments
    );
    this.initGraphData();
  }

  initGraphData(): void {
    this.graphData.data.datasets[0].data = [
      this.sentimentData.negative,
      this.sentimentData.neutral,
      this.sentimentData.positive,
    ];
    this.graphData.data.datasets[0].backgroundColor = [
      this.colors.negative,
      this.colors.neutral,
      this.colors.positive,
    ];
  }
}
