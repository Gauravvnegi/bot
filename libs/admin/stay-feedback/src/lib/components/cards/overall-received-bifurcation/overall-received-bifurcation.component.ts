import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { Bifurcation } from '../../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-overall-received-bifurcation',
  templateUrl: './overall-received-bifurcation.component.html',
  styleUrls: ['./overall-received-bifurcation.component.scss'],
})
export class OverallReceivedBifurcationComponent implements OnInit {
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: Bifurcation;
  feedbackChart = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: chartConfig.defultColor,
    Options: chartConfig.options.distribution,
  };

  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe(
        (data) => {
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
          this.getStats();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  /**
   * @function getStats To get received feedback bifurcation data.
   */
  getStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
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
    if (defaultGraph) {
      this.feedbackChart.Labels = ['No Data'];
      this.feedbackChart.Data = [[100]];
      this.feedbackChart.Colors = chartConfig.defultColor;
      return;
    }
    this.feedbackChart.Data = [[]];
    this.feedbackChart.Labels = [];
    this.feedbackChart.Colors = [
      {
        backgroundColor: [],
        borderColor: [],
      },
    ];
    const data = this.stats.feedbacks;
    data.forEach((feedback) => {
      if (feedback.score) {
        this.feedbackChart.Data[0].push(feedback.score);
        this.feedbackChart.Labels.push(feedback.label);
        this.feedbackChart.Colors[0].backgroundColor.push(feedback.color);
        this.feedbackChart.Colors[0].borderColor.push(feedback.color);
      }
    });
  }
}
