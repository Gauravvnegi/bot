import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { guest } from '../../../constants/guest';
import { VIP } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';
import { ChartTypeOption } from '../../../types/guest.type';

@Component({
  selector: 'hospitality-bot-type-guest-statistics',
  templateUrl: './type-guest-statistics.component.html',
  styleUrls: ['./type-guest-statistics.component.scss'],
})
export class TypeGuestStatisticsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  selectedInterval: any;
  customerData: VIP;
  $subscription = new Subscription();
  globalQueries = [];
  tabFilterItems = guest.tabFilterItems.type;
  legendData = guest.legend.typeGuest;
  chartTypes = guest.chartTypes.typeGuest;
  guestConfig = guest;
  guestType = '';

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  guestTypes = guest.dropdown.typeGuest;

  chart: any = {
    chartData: [
      { data: [], label: 'Due-In', fill: false },
      { data: [], label: 'In House', fill: false },
      { data: [], label: 'Due-Out', fill: false },
      { data: [], label: 'Check-Out', fill: false },
    ],
    chartLabels: [],
    chartOptions: {
      ...chartConfig.options.type,
      legendCallback: this.getLegendCallback,
    },
    chartColors: chartConfig.colors.typeGuest,
    chartLegend: false,
    chartType: chartConfig.type.line,
  };

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private dateService: DateService
  ) {}

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
          calenderType: this.dateService.getCalendarType(
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
        this.getVIPStatistics();
      })
    );
  }

  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index, event) => {
    event.stopPropagation();
    const ci = this.baseChart.chart;
    const alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;
    ci.data.datasets.forEach((e, i) => {
      const meta = ci.getDatasetMeta(i);

      if (i === index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    ci.update();
  };

  /**
   * @function setChartType To set chart type based on value selected.
   * @param option The selected chart option.
   * @param event The radio button event.
   */
  setChartType(option: ChartTypeOption, event): void {
    event.stopPropagation();
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
    }
  }

  /**
   * @function initGraphData To initialize graph data, labels and colors.
   */
  private initGraphData(): void {
    const botKeys = Object.keys(this.customerData.inHouse);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((timestamp) => {
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          timestamp,
          this.globalFilterService.timezone,
          this._adminUtilityService.getDateFormatFromInterval(
            this.selectedInterval
          ),
          this.selectedInterval === guest.interval.week
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.chart.chartData[0].data.push(this.customerData.dueIn[timestamp]);
      this.chart.chartData[1].data.push(this.customerData.inHouse[timestamp]);
      this.chart.chartData[2].data.push(this.customerData.dueOut[timestamp]);
      this.chart.chartData[3].data.push(this.customerData.outGuest[timestamp]);
    });
  }

  /**
   * @function getVIPStatistics To get the guest stats based on VIP type.
   */
  private getVIPStatistics(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { guestType: this.guestType },
      ]),
    };
    this.$subscription.add(
      this.$subscription.add(
        this._statisticService.getVIPStatistics(config).subscribe(
          (response) => {
            this.customerData = new VIP().deserialize(response);
            this.initGraphData();
          },
          ({ error }) => {  }
        )
      )
    );
  }

  handleGuestTypeChange(event) {
    this.guestType = event.value;
    this.getVIPStatistics();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
