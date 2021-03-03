import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-ocr-usage',
  templateUrl: './ocr-usage.component.html',
  styleUrls: ['./ocr-usage.component.scss']
})
export class OcrUsageComponent implements OnInit {
  chartTypes = [
    {
      name: 'Bar',
      value: 'horizontalBar',
      url: 'assets/svg/bar-graph.svg',
      backgroundColor: '#4BA0F5',
    },
    {
      name: 'Line',
      value: 'line',
      url: 'assets/svg/line-graph.svg',
      backgroundColor: '#DEFFF3',
    },
  ];

  chart: any = {
    chartData: [
      {
        data: [600, 750, 1000],
        label: 'Total Users',
      },
    ],
    chartLabels: ['Visa', 'Passport', 'Adhaar Card'],
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
            ticks: {
              min: 0,
              max: 1500,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    chartColors: [
      {
        borderColor: '#4BA0F5',
        backgroundColor: '#4BA0F5',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0C8054',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: '#0C8054',
      },
    ],
    chartLegend: false,
    chartType: 'horizontalBar',
  };

  ngOnInit(): void {}

  setChartType(option, event): void {
    event.stopPropagation();
    this.chart.chartType = option.value;
    this.chart.chartColors[0].backgroundColor = option.backgroundColor;
  }
}
