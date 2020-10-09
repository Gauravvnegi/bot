import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Customer } from '../../data-models/statistics.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { BaseChartDirective } from 'ng2-charts';


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
    {name: 'D', value: 'day'},
    {name: 'M', value: 'month'},
    {name: 'Y', value: 'year'},
  ];

  selectedInterval: string = 'day';
  @Output() interval = new EventEmitter();

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
  ) {
  }

  ngOnInit(): void {
    this.initGraphData();
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.checkIn);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(this._dateService.convertTimestampToDate(d, this.selectedInterval === 'day'
          ?'h mm a'
          : this.selectedInterval === 'month'
            ? 'D MMM'
            : 'MMM YYYY'));
      this.chart.chartData[0].data.push(this.customerData.checkIn[d]);
      this.chart.chartData[1].data.push(this.customerData.expressCheckIn[d]);
      this.chart.chartData[2].data.push(this.customerData.checkout[d]);
      this.chart.chartData[3].data.push(this.customerData.expressCheckout[d]);
    });
  }

  setSelectedOption(option) {
    this.selectedInterval = option.value;
    this.interval.emit({ interval: option.value });
    this.initGraphData();
  }

  legendOnClick = function (index) {
    let ci = this.baseChart.chart;
    let alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach(function(e, i) {
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

}
