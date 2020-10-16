import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Customer } from '../../data-models/statistics.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsService } from '../../services/statistics.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import * as moment from 'moment';

@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss']
})
export class CustomerStatisticsComponent implements OnInit {
  @Input() customerData: Customer;
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  legendData;
  intervals = [
    {name: 'T', value: 'day'},
    {name: 'D', value: 'date'},
    {name: 'M', value: 'month'},
    {name: 'Y', value: 'year'},
  ];

  selectedInterval: any;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function(chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chart = {
    chartData: [
      { data: [], label: 'Check-In', fill: false },
      { data: [], label: 'Express Check-In', fill: false, borderDash: [10,5] },
      { data: [], label: 'Checkout', fill: false },
      { data: [], label: 'Express Checkout', fill: false, borderDash: [10,5] },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      scales: {
        xAxes: [{
           gridLines: {
              display: true
           }
        }],
        yAxes: [{
           gridLines: {
              display: false
           },
           ticks: {
            min: 0,
            stepSize: 1,
          }
        }]
      },
      legendCallback: this.getLegendCallback
    },
    chartColors: [
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
    private _statisticService: StatisticsService
  ) {
  }

  ngOnInit(): void {
    this.selectedInterval = this.intervals[0];
    this.getCustomerStatistics(this.intervals[0]);
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.checkIn);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(this.convertTimestampToLabels(this.selectedInterval['value'], d));
      this.chart.chartData[0].data.push(this.customerData.checkIn[d]);
      this.chart.chartData[1].data.push(this.customerData.expressCheckIn[d]);
      this.chart.chartData[2].data.push(this.customerData.checkout[d]);
      this.chart.chartData[3].data.push(this.customerData.expressCheckout[d]);
    });
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
      returnTime = `${data > 12 ? data - 12 : data}:00 ${data > 11 ? 'PM' : 'AM'}`
    }
    return returnTime;
  }

  legendOnClick = (index) => {
    let ci = this.baseChart.chart;
    let alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

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
  }

  getCustomerStatistics(event) {
    this.selectedInterval = event;
    // this.selectedInterval()
    let hotelInfo = { hotelId: 'ca60640a-9620-4f60-9195-70cc18304edd' };
    let calenderType = { calenderType: event.value };
    const queries = [hotelInfo, calenderType];
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    this._statisticService.getCustomerStatistics(config)
      .subscribe(res => {
        this.customerData = new Customer().deserialize(res);
        this.initGraphData();
      })
  }

}
