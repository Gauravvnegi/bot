import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
  CircularChart,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { globalFeedback } from '@hospitality-bot/admin/feedback';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { FeedbackDistribution } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit {
  globalFeedbackConfig = globalFeedback;
  globalQueries;
  $subscription = new Subscription();
  totalDistribution = 0;
  color = feedback.colorConfig.distribution;

  defaultChart: CircularChart = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: chartConfig.colors.distribution,
    Options: chartConfig.options.distribution,
  };

  chart: CircularChart = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: chartConfig.colors.distribution,
    Options: chartConfig.options.distribution,
  };

  keyLabels = [];
  loading: boolean = false;

  distribution: FeedbackDistribution;
  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getFeedbackDistribution();
      })
    );
  }

  /**
   * @function initChartData Initializes the graph data.
   */
  initChartData(): void {
    this.totalDistribution = 0;
    this.keyLabels.length = this.chart.Data[0].length = this.chart.Labels.length = this.chart.Colors[0].backgroundColor.length = this.chart.Colors[0].borderColor.length = 0;
    this.distribution.data.forEach((data) => {
      if (data.count) {
        this.chart.Labels.push(data.label);
        this.chart.Data[0].push(data.count);
        this.chart.Colors[0].backgroundColor.push(data.color);
        this.chart.Colors[0].borderColor.push(data.color);
      }
      this.totalDistribution += data.count;
      this.keyLabels.push({
        ...data,
        color: data.color,
      });
    });
  }

  /**
   * @function getFeedbackDistribution gets the feedback distribution stats from api.
   */
  getFeedbackDistribution() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.feedbackDistribution(config).subscribe(
      (response) => {
        this.loading = false;
        this.distribution = new FeedbackDistribution().deserialize(response);
        this.initChartData();
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }
}
