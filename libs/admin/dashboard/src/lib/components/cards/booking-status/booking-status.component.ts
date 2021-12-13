import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { BookingStatus } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
})
export class BookingStatusComponent implements OnInit {
  @Input() customerData: BookingStatus;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();

  legendData = [
    {
      label: 'New',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
    },
    {
      label: 'Pre Check-In',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
    },
    {
      label: 'Check-In',
      borderColor: '#0ea47a',
      backgroundColor: '#0ea47a',
      dashed: false,
    },
    {
      label: 'Checkout',
      borderColor: '#ff4545',
      backgroundColor: '#ff4545',
      dashed: true,
    },
  ];
  chartTypes = [
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
  ];

  selectedInterval: any;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart: any = {
    chartData: [
      { data: [], label: 'New', fill: false, borderDash: [10, 5] },
      { data: [], label: 'Pre Check-In', fill: false },
      { data: [], label: 'Check-In', fill: false },
      { data: [], label: 'Checkout', fill: false, borderDash: [10, 5] },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 1,
            },
          },
        ],
      },
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
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#0749fc',
      },
      {
        borderColor: '#f2509b',
      },
      {
        borderColor: '#0ea47a',
      },
      {
        borderColor: '#ff4545',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  timeShow = false;
  globalQueries;

  constructor(
    private dateService: DateService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  setChartType(option) {
    this.chart.chartType = option.value;
    this.setChartColors();
  }

  setChartColors() {
    if (this.chart.chartType === 'bar') {
      this.chart.chartColors = [
        {
          backgroundColor: '#0749fc',
        },
        {
          backgroundColor: '#0239CF',
        },
        {
          backgroundColor: '#288ad6',
        },
        {
          backgroundColor: '#F2509B',
        },
      ];
    }
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
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
        this.getCustomerStatistics();
      })
    );
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.checkIn);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d, i) => {
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
          this._globalFilterService.timezone,
          this.selectedInterval === 'date' && this.selectedInterval === 'week'
            ? 'DD MMM'
            : this.selectedInterval === 'month'
            ? 'MMM YYYY'
            : '',
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.chart.chartData[0].data.push(this.customerData.new[d]);
      this.chart.chartData[1].data.push(this.customerData.preCheckIn[d]);
      this.chart.chartData[2].data.push(this.customerData.checkIn[d]);
      this.chart.chartData[3].data.push(this.customerData.checkout[d]);
    });
    this.setChartColors();
  }

  legendOnClick = (index) => {
    let ci = this.baseChart.chart;
    let alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      let meta = ci.getDatasetMeta(i);

      if (i == index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    ci.update();
  };

  getCustomerStatistics() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService
        .getBookingStatusStatistics(config)
        .subscribe((res) => {
          this.customerData = new BookingStatus().deserialize(res);
          this.initGraphData();
        })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
