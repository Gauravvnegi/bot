import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../../data-models/statistics.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';


@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss']
})
export class CustomerStatisticsComponent implements OnInit {
  @Input() customerData: Customer;
  chart = {
    total: 0,
    vip: 0,
    bot: 0,
    chartData: [
      { data: [], label: 'VIP', fill: false },
      { data: [], label: 'BOT', fill: false },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: false,
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
            display: false
          }
        }]
      },
    },
    chartColors: [
      {
        borderColor: '#218AF3',
      },
      {
        borderColor: '#F2509B',
      }
    ],  
    chartLegend: false,
    chartType: 'line',
  }

  constructor(private _dateService: DateService) { }

  ngOnInit(): void {
    this.initGraphData();
  }

  private initGraphData() {
    const botKeys = Object.keys(this.customerData.botUser.chart);
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(this._dateService.convertTimestampToDate(d, 'D MMM'));
      this.chart.chartData[0].data.push(this.customerData.botUser.chart[d]);
      this.chart.chartData[1].data.push(this.customerData.vipUser.chart[d]);
    });
    this.chart['total'] = this.customerData.totalCount;
    this.chart['bot'] = this.customerData.botUser.totalCount;
    this.chart['vip'] = this.customerData.vipUser.totalCount;
  }

}
