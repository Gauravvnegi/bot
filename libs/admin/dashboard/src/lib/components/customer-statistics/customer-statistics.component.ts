import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Customer } from '../../data-models/statistics.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from '../../services/statistics.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import * as moment from 'moment';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss'],
})
export class CustomerStatisticsComponent implements OnInit, OnDestroy {
  @Input() customerData: Customer;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();

  legendData = [
    {
      label: 'New',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: false,
    },
    {
      label: 'Check-In',
      borderColor: '#0239cf',
      backgroundColor: '#0239cf',
      dashed: false,
    },
    {
      label: 'Ex Check-In',
      borderColor: '#0239cf',
      backgroundColor: '#288ad6',
      dashed: true,
    },
    {
      label: 'Checkout',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
    },
    {
      label: 'Ex Checkout',
      borderColor: '#f2509b',
      backgroundColor: '#f2809b',
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
      { data: [], label: 'New', fill: false },
      { data: [], label: 'Check-In', fill: false },
      { data: [], label: 'Express Check-In', fill: false, borderDash: [10, 5] },
      { data: [], label: 'Checkout', fill: false },
      { data: [], label: 'Express Checkout', fill: false, borderDash: [10, 5] },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              min: 0,
              stepSize: 1,
            },
          },
        ],
      },
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#0749fc',
      },
      {
        borderColor: '#0239CF',
      },
      {
        borderColor: '#0239CF',
      },
      {
        borderColor: '#F2509B',
      },
      {
        borderColor: '#F2509B',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  timeShow = false;

  constructor(
    private _dateService: DateService,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService
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
        {
          backgroundColor: '#F2809B',
        },
      ];
    }
  }

  ngOnInit(): void {
    this.getCustomerStatistics();
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.checkIn);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(
        this.convertTimestampToLabels(this.selectedInterval, d)
      );
      this.chart.chartData[0].data.push(this.customerData.new[d]);
      this.chart.chartData[1].data.push(this.customerData.checkIn[d]);
      this.chart.chartData[2].data.push(this.customerData.expressCheckIn[d]);
      this.chart.chartData[3].data.push(this.customerData.checkout[d]);
      this.chart.chartData[4].data.push(this.customerData.expressCheckout[d]);
    });
    this.setChartColors();
  }

  convertTimestampToLabels(type, data) {
    let returnTime;
    if (type === 'year') {
      returnTime = data;
    } else if (type === 'month') {
      returnTime = moment.unix(data).format('MMM YYYY');
    } else if (type === 'date') {
      returnTime = this._dateService.convertTimestampToDate(data, 'DD MMM');
    } else {
      returnTime = `${data > 12 ? data - 12 : data}:00 ${
        data > 11 ? 'PM' : 'AM'
      }`;
    }
    return returnTime;
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
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
        };
        this.$subscription.add(
          this._statisticService
            .getCustomerStatistics(config)
            .subscribe((res) => {
              this.customerData = new Customer().deserialize(res);
              this.initGraphData();
            })
        );
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
