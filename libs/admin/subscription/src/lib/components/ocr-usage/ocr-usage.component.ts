import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '@hospitality-bot/shared/utils';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';

@Component({
  selector: 'hospitality-bot-ocr-usage',
  templateUrl: './ocr-usage.component.html',
  styleUrls: ['./ocr-usage.component.scss'],
})
export class OcrUsageComponent implements OnInit {
  @Input() data;
  @Input() chartData;
  @Input() usage: number;
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
      this.chart.chartData[0].data.push(data.value);
      this.chart.chartLabels.push(data.label);
    });
  }

  format(value) {
    return AdminUtilityService.valueFormatter(value, 2);
  }
}
