import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BarChart,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { dashboard } from '../../../constants/dashboard';
import { BookingStatus } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { ChartTypeOption } from '../../../types/dashboard.type';

@Component({
  selector: 'hospitality-bot-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
})
export class BookingStatusComponent implements OnInit, OnDestroy {
  @Input() customerData: BookingStatus;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();

  legendData = dashboard.legend.bookingStatus;
  chartTypes: ChartTypeOption[] = chartConfig.chartTypes;

  selectedInterval = '';

  chart: BarChart = {
    data: chartConfig.bookingStatus.defaultData,
    labels: [],
    options: dashboard.chart.option.bookingStatus,
    colors: dashboard.chart.color.bookingStatus,
    legend: false,
    type: chartConfig.types.line,
  };
  timeShow = false;
  globalQueries = [];

  constructor(
    private _dateService: DateService,
    private _statisticService: StatisticsService,
    private globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService
  ) {}

  /**
   * @function setChartType To set the current chart type as the selected one.
   * @param option The chart type option.
   */
  setChartType(option: ChartTypeOption): void {
    this.chart.type = option.value;
    this.setChartColors();
  }

  /**
   * @function setChartColors Sets the chart color for bar graph.
   */
  setChartColors() {
    if (this.chart.type === chartConfig.types.bar) {
      this.chart.colors = chartConfig.bookingStatus.barColors;
    }
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this._dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getCustomerStatistics();
      })
    );
  }

  /**
   * @function initGraphData To initialize the graph data based on the api values.
   */
  private initGraphData(): void {
    const timestamps = Object.keys(this.customerData?.checkIn);
    this.chart.data.map((d) => (d.data = []));
    this.chart.labels = [];
    timestamps.forEach((timestamp, i) => {
      this.chart.labels.push(
        this._dateService.convertTimestampToLabels(
          this.selectedInterval,
          timestamp,
          this.globalFilterService.timezone,
          this.extractFormatFromSelectedInterval(),
          this.selectedInterval === sharedConfig.timeInterval.week
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.chart.data[0].data.push(this.customerData.checkIn[timestamp]);
      this.chart.data[1].data.push(this.customerData.checkout[timestamp]);
    });
    this.setChartColors();
  }

  extractFormatFromSelectedInterval() {
    if (
      this.selectedInterval === sharedConfig.timeInterval.date &&
      this.selectedInterval === sharedConfig.timeInterval.week
    )
      return 'DD MMM';
    else if (this.selectedInterval === sharedConfig.timeInterval.month)
      return 'MMM YYYY';
    else return '';
  }
  /**
   * @function legendOnClick To handle legend click for the graph.
   * @param index The index of the legend.
   */
  legendOnClick = (index) => {
    const chartRef = this.baseChart.chart;
    const alreadyHidden =
      chartRef.getDatasetMeta(index).hidden === null
        ? false
        : chartRef.getDatasetMeta(index).hidden;

    chartRef.data.datasets.forEach((error, i) => {
      const meta = chartRef.getDatasetMeta(i);

      if (i === index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    chartRef.update();
  };

  /**
   * @function getCustomerStatistics To get the graph data from the api.
   */
  getCustomerStatistics(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getBookingStatusStatistics(config).subscribe(
        (res) => {
          this.customerData = new BookingStatus().deserialize(res);
          this.initGraphData();
        },
        ({ error }) =>
          this.snackbarService
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get dashboardConfig() {
    return dashboard;
  }
}
