import { Component, OnInit, Input } from '@angular/core';
import { Customer } from '../../data-models/statistics';


@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss']
})
export class CustomerStatisticsComponent implements OnInit {

  @Input() customer: Customer = {
    total: 1500,
    bot: 1075,
    vip: 425,
    chartData: [
      { data: [72, 75, 75, 81, 78], label: 'VIP', fill: false },
      { data: [72, 81, 78, 85, 74], label: 'BOT', fill: false },
    ],
    chartLabels: ['4 Jul', '11 Jul', '18 Jul', '25 Jul', '31 Jul'],
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
            display: false
          }
        }]
      }
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

  constructor() { }

  ngOnInit(): void {
  }

}
