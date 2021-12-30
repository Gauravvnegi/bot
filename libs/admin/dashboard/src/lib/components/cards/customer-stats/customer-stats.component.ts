import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { dashboard } from '../../../constants/dashboard';
import { ReservationStat } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-stats.component.html',
  styleUrls: ['./customer-stats.component.scss'],
})
export class CustomerStatisticsComponent implements OnInit, OnDestroy {
  private $subscription = new Subscription();
  statData: ReservationStat;
  globalQueries = [];

  checkinChart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.types.doughnut,
    legend: false,
    colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    options: dashboard.chart.option.reservation,
  };

  checkoutChart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.types.doughnut,
    legend: false,
    colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    options: dashboard.chart.option.reservation,
  };

  constructor(
    private _statisticsService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private _dateService: DateService,
    private _snackbarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getReservationStatistics();
      })
    );
  }

  /**
   * @function getReservationStatistics To get the reservation graph data from api.
   */
  getReservationStatistics(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticsService.getReservationStatistics(config).subscribe(
        (response) => {
          this.statData = new ReservationStat().deserialize(response);
          this.initCheckinChart();
          this.initCheckoutChart();
        },
        ({ error }) =>
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  /**
   * @function initCheckinChart To initialize the Checkin Chart Data.
   */
  initCheckinChart(): void {
    this.checkinChart.data[0].length = this.checkinChart.labels.length = this.checkinChart.colors[0].backgroundColor.length = this.checkinChart.colors[0].borderColor.length = 0;
    if (this.statData?.checkin?.totalCount) {
      const keys = Object.keys(this.statData?.checkin).filter(
        (key) => key !== 'totalCount'
      );
      keys.forEach((key) => {
        this.setChartData(this.checkinChart, key, this.statData.checkin);
      });
    } else {
      this.setChartData(this.checkinChart);
    }
  }

  /**
   * @function initCheckoutChart To initialize the Checkout Chart Data.
   */
  initCheckoutChart(): void {
    this.checkoutChart.data[0].length = this.checkoutChart.labels.length = this.checkoutChart.colors[0].backgroundColor.length = this.checkoutChart.colors[0].borderColor.length = 0;
    if (this.statData?.checkout?.totalCount) {
      const keys = Object.keys(this.statData?.checkout).filter(
        (key) => key !== 'totalCount'
      );
      keys.forEach((key) => {
        this.setChartData(this.checkoutChart, key, this.statData.checkout);
      });
    } else {
      this.setChartData(this.checkoutChart);
    }
  }

  /**
   * @function setChartData To set chart data, label and colors.
   * @param chart The chart data reference.
   */
  setChartData(chart: CircularChart, key?: string, dataset?): void {
    if (key) {
      this._translateService
        .get(`card.customer.legend.${key}`)
        .subscribe((message) => chart.labels.push(message));
      chart.data[0].push(dataset[key]);
      chart.colors[0].backgroundColor.push(chartConfig.customer.colors[key]);
      chart.colors[0].borderColor.push(chartConfig.customer.colors[key]);
      return;
    }
    // Info: set default chart data
    this._translateService
      .get('graph_no_data')
      .subscribe((message) => (chart.labels = [message]));
    chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
    chart.colors[0].borderColor.push(chartConfig.defaultColor);
    chart.data = [[100]];
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get dashboardConfig() {
    return dashboard;
  }
}
