import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../../data-models/statistics.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';


@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss']
})
export class CustomerStatisticsComponent implements OnInit {
  @Input() customerData: Customer;
  chart;
  timeShow = false;

  constructor(
    private _dateService: DateService,
    private _globalFilterService: GlobalFilterService
  ) { }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
      // let hotelInfo = { hotelId: 'ca60640a-9620-4f60-9195-70cc18304edd' };
      const dates = data['dateRange'].queryValue;
      const dayDiff = this._dateService.getDateDifference(dates[0].toDate, dates[1].fromDate);
      this.timeShow = dayDiff === 0;
      this.initGraphData();
    });
  }

  private initGraphData() {
    this.chart = {
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
    const botKeys = Object.keys(this.customerData.checkIn);
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(this._dateService.convertTimestampToDate(d, this.timeShow ? 'h mm a' : 'D MMM'));
      this.chart.chartData[0].data.push(this.customerData.checkIn[d]);
      this.chart.chartData[1].data.push(this.customerData.expressCheckIn[d]);
      this.chart.chartData[2].data.push(this.customerData.checkout[d]);
      this.chart.chartData[3].data.push(this.customerData.expressCheckout[d]);
    });
  }

}
