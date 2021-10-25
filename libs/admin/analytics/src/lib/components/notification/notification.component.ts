import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  chart: any = {
    chartData: [
      {
        data: [80, 160, 78],
        label: '',
      },
    ],
    chartLabels: ['Pre-Check-In', 'Post Check-In', 'Post Check-Out'],
    chartOptions: {
      responsive: true,
      cornerRadius: 20,
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
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
            },
          },
        ],
        yAxes: [
          {
            maxBarThickness: 30,
            barPercentage: 0.4,
            display: false,
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    chartColors: [
      {
        borderColor: ['#3270eb', '#15eda3', '#ff9867'],
        backgroundColor: ['#3270eb', '#15eda3', '#ff9867'],
      },
    ],
    chartLegend: false,
    chartType: 'horizontalBar',
  };
  constructor() {}

  ngOnInit(): void {}

  legendOnClick = (index, event) => {
    event.stopPropagation();
    let ci = this.baseChart.chart;
    let alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets[0].data.forEach((e, i) => {
      let meta = ci.getDatasetMeta(i);
      if (!meta.data[i].hidden) {
        meta.data[i].hidden = true;
      } else {
        meta.data[i].hidden = false;
      }
      return;
    });

    ci.update();
  };

  get colors() {
    return this.chart.chartColors[0].borderColor;
  }

  get labels() {
    return this.chart.chartLabels;
  }
}
