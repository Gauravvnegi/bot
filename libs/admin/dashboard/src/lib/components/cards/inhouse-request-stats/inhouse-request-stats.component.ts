import { Component, Input, OnChanges } from '@angular/core';
import { CircularChart } from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { chartConfig } from '../../../constants/chart';
import { dashboard } from '../../../constants/dashboard';
import { InhouseRequest } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-inhouse-request-statistics',
  templateUrl: './inhouse-request-stats.component.html',
  styleUrls: ['./inhouse-request-stats.component.scss'],
})
export class InhouseRequestStatisticsComponent implements OnChanges {
  @Input() inhouseRequest: InhouseRequest;
  requestPendingPercent: number;

  chart: CircularChart = {
    labels: ['No Data'],
    data: [[100]],
    type: chartConfig.types.doughnut,
    legend: false,
    colors: chartConfig.default.colors,
    options: dashboard.chart.option.inhouseRequest,
  };

  constructor(private _translateService: TranslateService) {}

  ngOnChanges(): void {
    this.initGraphData();
  }

  /**
   * @function initGraphData Initializes the graph data.
   */
  private initGraphData(): void {
    this.chart.data = [[]];
    this.chart.data[0][0] = this.inhouseRequest?.completed;
    this.chart.data[0][1] = this.inhouseRequest?.pending;
    this.chart.data[0][2] = this.inhouseRequest?.timeout;

    if (this.chart.data[0].reduce((acc, curr) => acc + curr, 0)) {
      this.setChartOptions();
    } else {
      this.chart.data = [[100]];
      this.chart.colors = chartConfig.default.colors;
      this._translateService
        .get('graph_no_data')
        .subscribe((message) => (this.chart.labels = [message]));
    }
  }

  /**
   * @function setChartOptions Sets the chart options for the graph.
   */
  setChartOptions(): void {
    this.chart.colors = dashboard.chart.color.inhouseRequest;
    this.chart.labels = dashboard.chart.labels.inhouseRequest;
  }

  get dashboardConfig() {
    return dashboard;
  }
}
