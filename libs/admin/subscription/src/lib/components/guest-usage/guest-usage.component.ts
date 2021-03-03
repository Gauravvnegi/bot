import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-usage',
  templateUrl: './guest-usage.component.html',
  styleUrls: ['./guest-usage.component.scss']
})
export class GuestUsageComponent implements OnInit {

  chartTypes = [
    {
      name: 'Bar',
      value: 'bar',
      url: 'assets/svg/bar-graph.svg',
      backgroundColor: ['#FFBF04','#D7D9DB'],
    },
    {
      name: 'Line',
      value: 'line',
      url: 'assets/svg/line-graph.svg',
      backgroundColor: '#1AB99F',
    },
  ];

  chart: any = {
    chartData: {
      datasets: [
        { data: [5000, 5000, 7000, 9000, 12000], label: 'Bar 1' },
        { data: [7000, 7000, 9000, 11000, 14000], label: 'Bar 2' },
      ],
      // data: [5, 5, 7, 9, 12],
      label: 'Total Users',
    },

    chartLabels: ['02 Feb', '09 Feb', '16 Feb', '23 Feb', '02 Mar'],
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
            },
          },
        ],
      },
    },
    chartColors: [
      {
        borderColor: '#FFBF04',
        backgroundColor: '#FFBF04',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0C8054',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: '#0C8054',
      },
      {
        borderColor: '#D7D9DB',
        backgroundColor: '#D7D9DB',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0C8054',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: '#0C8054',
      },
    ],
    chartLegend: false,
    chartType: 'bar',
  };

  constructor() { }

  ngOnInit(): void {
  }

  setChartType(option, event): void {
    event.stopPropagation();
    this.chart.chartType = option.value;
    this.chart.chartColors[0].backgroundColor = option.backgroundColor[0];
    this.chart.chartColors[1].backgroundColor = option.backgroundColor[1];
  }
}
