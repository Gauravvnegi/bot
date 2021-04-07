import { Component, Input, OnInit } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-ocr-usage',
  templateUrl: './ocr-usage.component.html',
  styleUrls: ['./ocr-usage.component.scss'],
})
export class OcrUsageComponent implements OnInit {
  // chartTypes = [
  //   {
  //     name: 'Bar',
  //     value: 'horizontalBar',
  //     url: 'assets/svg/bar-graph.svg',
  //     backgroundColor: '#4BA0F5',
  //   },
  //   {
  //     name: 'Line',
  //     value: 'line',
  //     url: 'assets/svg/line-graph.svg',
  //     backgroundColor: '#DEFFF3',
  //   },
  // ];

  @Input() data;
  @Input() chartData;
  chart: any = {
    chartData: [
      {
        data: [],
        label: 'Total Users',
      },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 10,
        xPadding: 10,
        yPadding: 10,
      },
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
              // stepSize: 1,
              // max: 1,
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

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    if (this.chartData) {
      this.initChart();
    }
  }

  initChart() {
    this.chart.chartData[0].data = [];
    this.chart.chartLabels = [];
    this.chartData.forEach((data) => {
      // if (
      //   this.chart.chartOptions.scales.xAxes[0].ticks.stepSize <
      //   data.value / this.chartData.length
      // ) {
      //   this.chart.chartOptions.scales.xAxes[0].ticks.stepSize = Number(
      //     data.value / this.chartData.length
      //   );
      // }
      this.chart.chartData[0].data.push(data.value);
      this.chart.chartLabels.push(data.label);
    });
  }

  setChartType(option, event): void {
    event.stopPropagation();
    this.chart.chartType = option.value;
    this.chart.chartColors[0].backgroundColor = option.backgroundColor;
  }
}
