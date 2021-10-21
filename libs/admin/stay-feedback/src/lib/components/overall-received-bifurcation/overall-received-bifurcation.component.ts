import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { Bifurcation } from '../../data-models/statistics.model';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';

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
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
      responsive: true,
      cutoutPercentage: 75,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
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

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
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

  getStats() {
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

  initFeedbackChart(defaultGraph) {
    if (defaultGraph) {
      this.feedbackChart.Labels = ['No Data'];
      this.feedbackChart.Data = [[100]];
      this.feedbackChart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
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

  get feedbackReceivedData() {
    return this.stats;
  }
}
