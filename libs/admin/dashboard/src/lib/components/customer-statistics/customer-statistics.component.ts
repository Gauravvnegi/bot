import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-customer-statistics',
  templateUrl: './customer-statistics.component.html',
  styleUrls: ['./customer-statistics.component.scss']
})
export class CustomerStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  myColors = ['#218AF3', '#F2509B']

  lineChartData: ChartDataSets[] = [
    { data: [72, 78, 75, 77, 75], label: 'VIP', fill: false },
    { data: [85, 89, 83, 87, 84], label: 'BOT', fill: false },
  ];

  lineChartLabels: Label[] = ['4 Jul', '11 Jul', '18 Jul', '25 Jul', '31 Jul'];

  lineChartOptions = {
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
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#218AF3',
    },
    {
      borderColor: '#F2509B',
    }
  ];

  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';

}
