import { Component, OnInit } from '@angular/core';
import { SentimentalChart } from '../../constants/sentimental-chart';
import { colorConfig, MockData } from '../../constants/sentimental-mock-data';
import { Topics } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  chart = SentimentalChart.topicsBarGraph;
  graphData: Topics;
  constructor() {}

  ngOnInit(): void {
    this.graphData = new Topics().deserialize(MockData.topics, colorConfig);
    this.initChartData();
  }

  initChartData(): void {
    this.chart.colors[0].backgroundColor = this.graphData.colors;
    this.chart.labels = [];
    this.chart.datasets = [{ data: [], label: '' }];
    this.graphData.topics.forEach((item) => {
      this.chart.labels.push(item.label);
      this.chart.datasets[0].data.push(item.value);
    });
  }
}
