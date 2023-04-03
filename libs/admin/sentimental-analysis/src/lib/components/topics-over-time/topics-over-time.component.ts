import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { SentimentalChart } from '../../constants/sentimental-chart';
import { colorConfig, MockData } from '../../constants/sentimental-mock-data';
import { TopicsOverTimes } from '../../data-models/sentiment.model';

@Component({
  selector: 'hospitality-bot-topics-over-time',
  templateUrl: './topics-over-time.component.html',
  styleUrls: ['./topics-over-time.component.scss'],
})
export class TopicsOverTimeComponent implements OnInit {
  mockData = MockData.topicsOverTime;
  chart = SentimentalChart.topicsOverTime;
  graphData: TopicsOverTimes;
  $subscription = new Subscription();
  constructor(
    private globalFilterService: GlobalFilterService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initGraphData();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = this.dateService.getCalendarType(
          data['dateRange'].queryValue[0].toDate,
          data['dateRange'].queryValue[1].fromDate,
          this.globalFilterService.timezone
        );
        setTimeout(() => {
          this.graphData = new TopicsOverTimes().deserialize(
            MockData.topicsOverTime,
            colorConfig
          );
          this.initGraphData();
        }, 2000);
      })
    );
  }

  initGraphData(): void {
    this.chart.labels = this.graphData.labels;
    this.chart.datasets = this.graphData.defaultDataset;
    this.chart.colors = this.graphData.colors;
    this.graphData.topics.forEach((item, index) => {
      item.data.forEach((barData) => {
        this.chart.datasets[index].data.push(barData.value);
      });
    });
  }
}
