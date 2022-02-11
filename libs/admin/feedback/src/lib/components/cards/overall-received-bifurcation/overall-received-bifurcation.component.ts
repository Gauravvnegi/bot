import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { Bifurcation } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-overall-received-bifurcation',
  templateUrl: './overall-received-bifurcation.component.html',
  styleUrls: ['./overall-received-bifurcation.component.scss'],
})
export class OverallReceivedBifurcationComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  tabfeedbackType: string;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: Bifurcation;
  feedbackChart = {
    Labels: [],
    Data: [[]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.distribution,
  };

  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForReadStatusChange();
    if (
      this.globalFeedbackFilterType === feedback.types.transactional ||
      this.globalFeedbackFilterType === feedback.types.both
    )
      this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        )
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: this._statisticService.outletIds },
          ];
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getStats();
      })
    );
  }

  listenForReadStatusChange() {
    this.$subscription.add(
      this._statisticService.markReadStatusChanged.subscribe((response) => {
        if (response) this.getStats();
      })
    );
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
      ];
    else if (feedbackType === feedback.types.both) {
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
      ];
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          if (
            !this.globalQueries[
              this.globalQueries.length - 1
            ].entityIds.includes(element.hotelId)
          )
            this.globalQueries[this.globalQueries.length - 1].entityIds.push(
              element.hotelId
            );
        }
      });
    } else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.hotelId },
          ];
        }
      });
    }
  }

  listenForOutletChanged() {
    this._statisticService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabfeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this._statisticService.outletIds;
          }
        });
        this.getStats();
      }
    });
  }

  /**
   * @function getStats To get received feedback bifurcation data.
   */
  getStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService
        .getBifurcationStats(config)
        .subscribe((response) => {
          this.stats = new Bifurcation().deserialize(response);
          this.initFeedbackChart(
            this.stats.feedbacks.reduce(
              (accumulator, current) => accumulator + current.score,
              0
            ) === 0
          );
        })
    );
  }

  /**
   * @function initFeedbackChart To initialize chart data.
   * @param defaultGraph The data status.
   */
  initFeedbackChart(defaultGraph: boolean): void {
    this.feedbackChart.Data[0].length = this.feedbackChart.Labels.length = this.feedbackChart.Colors[0].backgroundColor.length = this.feedbackChart.Colors[0].borderColor.length = 0;
    if (defaultGraph) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => (this.feedbackChart.Labels = [message]));
      this.feedbackChart.Colors[0].backgroundColor.push(
        chartConfig.defaultColor
      );
      this.feedbackChart.Colors[0].borderColor.push(chartConfig.defaultColor);
      this.feedbackChart.Data = [[100]];
      return;
    }
    const data = this.stats.feedbacks;
    data.map((feedback) => {
      if (feedback.score) {
        this.feedbackChart.Data[0].push(feedback.score);
        this.feedbackChart.Labels.push(feedback.label);
        this.feedbackChart.Colors[0].backgroundColor.push(feedback.color);
        this.feedbackChart.Colors[0].borderColor.push(feedback.color);
      }
    });
  }

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === feedback.types.both
        ? ''
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === feedback.types.both
      ? ''
      : this.tabfeedbackType;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}