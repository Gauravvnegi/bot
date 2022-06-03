import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-rate-graph',
  templateUrl: './rate-graph.component.html',
  styleUrls: ['./rate-graph.component.scss'],
})
export class RateGraphComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  legendData: any = [
    {
      label: 'Open Rate',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
      src: 'delivered',
    },
    {
      label: 'Click Rate',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
      src: 'sent',
    },
  ];

  chart: any = {
    chartData: [
      { data: [10, 20, 35, 45, 59, 90], label: 'Sent', fill: true },
      { data: [5, 15, 25, 40, 50, 70], label: 'Delivered', fill: true },
    ],
    chartLabels: [
      'Campaign 1',
      'Campaign 2',
      'Campaign 3',
      'Campaign 4',
      'Campaign 5',
      'Campaign 6',
    ],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 4,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 5,
          hoverBorderWidth: 2,
        },
      },
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
              stepSize: 20,
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
    },
    chartColors: [
      {
        borderColor: '#FFBF04',
        backgroundColor: '#FFC10780',
        pointBackgroundColor: '#FFBF04',
        pointBorderColor: '#ffffff',
      },
      {
        borderColor: '#52B33F',
        backgroundColor: '#31BB9280',
        pointBackgroundColor: '#52B33F',
        pointBorderColor: '#ffffff',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  constructor() {}

  ngOnInit(): void {}
}
