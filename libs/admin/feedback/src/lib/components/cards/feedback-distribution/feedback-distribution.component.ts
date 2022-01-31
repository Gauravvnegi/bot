import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
  CircularChart,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { FeedbackDistribution } from '../../../data-models/statistics.model';
import { TranslateService } from '@ngx-translate/core';
import { chartConfig } from '../../../constants/chart';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  feedbackConfig = feedback;
  globalQueries;
  $subscription = new Subscription();
  totalDistribution = 0;
  color = feedback.colorConfig.distribution;

  chart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.type.doughnut,
    legend: false,
    colors: chartConfig.colors.distribution,
    options: chartConfig.options.distribution,
  };

  keyLabels = [];
  loading: boolean = false;

  distribution: FeedbackDistribution;
  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    if (
      this.globalFeedbackFilterType ===
        this.feedbackConfig.types.transactional ||
      this.globalFeedbackFilterType === this.feedbackConfig.types.both
    )
      this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        )
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: this.statisticsService.outletIds },
          ];
        this.getFeedbackDistribution();
      })
    );
  }

  listenForOutletChanged() {
    this.statisticsService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this.statisticsService.outletIds;
          }
        });
        this.getFeedbackDistribution();
      }
    });
  }

  /**
   * @function initChartData Initializes the graph data.
   */
  initChartData(): void {
    this.totalDistribution = 0;
    this.keyLabels.length = this.chart.data[0].length = this.chart.labels.length = this.chart.colors[0].backgroundColor.length = this.chart.colors[0].borderColor.length = 0;
    this.distribution.data.map((data) => {
      if (data.count) {
        this.chart.labels.push(data.label);
        this.chart.data[0].push(data.count);
        this.chart.colors[0].backgroundColor.push(data.color);
        this.chart.colors[0].borderColor.push(data.color);
      }
      this.totalDistribution += data.count;
      this.keyLabels.push({
        ...data,
        color: data.color,
      });
    });
    if (!this.chart.data[0].length) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => (this.chart.labels = [message]));
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      this.chart.data = [[100]];
    }
  }

  /**
   * @function getFeedbackDistribution gets the feedback distribution stats from api.
   */
  getFeedbackDistribution() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { feedbackType: this.globalFeedbackFilterType },
      ]),
    };
    this.statisticsService.feedbackDistribution(config).subscribe(
      (response) => {
        this.loading = false;
        this.distribution = new FeedbackDistribution().deserialize(response);
        this.initChartData();
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }
}
