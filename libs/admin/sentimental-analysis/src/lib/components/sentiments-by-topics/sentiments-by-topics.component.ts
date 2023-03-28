import { Component, OnInit } from '@angular/core';
import { MockData } from '../../constants/sentimental-mock-data';
import { Sentiment, SentimentByTopic } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-sentiments-by-topics',
  templateUrl: './sentiments-by-topics.component.html',
  styleUrls: ['./sentiments-by-topics.component.scss'],
})
export class SentimentsByTopicsComponent implements OnInit {
  data = {
    label: 'Sentiment by topics',
  };
  bars = MockData.sentimentsByTopic.graphData;
  graphData: Sentiment[];
  constructor() {}

  ngOnInit(): void {
    this.graphData = new SentimentByTopic().deserialize(
      MockData.sentimentsByTopic.graphData
    );
  }
}
