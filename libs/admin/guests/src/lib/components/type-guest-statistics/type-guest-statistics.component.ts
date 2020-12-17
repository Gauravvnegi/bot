import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-type-guest-statistics',
  templateUrl: './type-guest-statistics.component.html',
  styleUrls: ['./type-guest-statistics.component.scss']
})
export class TypeGuestStatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chartTypes = [
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
  ];

  chart: any = {
    chartData: [
      { data: [20, 25, 22, 30, 27, 45], label: 'New', fill: false },
      { data: [50, 65, 60, 75, 72, 80], label: 'Pre Check-In', fill: false },
      { data: [20, 28, 24, 35, 29, 55], label: 'Check-In', fill: false },
      { data: [50, 48, 60, 58, 65, 85], label: 'Checkout', fill: false },
    ],
    chartLabels: ['11 Jul', '25 Jul', '8 Aug', '22 Aug', '5 Sep', '19 Sep'],
    chartOptions: {
      responsive: true,
      elements: { 
        point: {
          radius: [0, 5 , 5, 5, 5, 5],
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2,
        },
        line: {
          tension: 0
        }
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
              stepSize: 25,
            },
          },
        ],
      },
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#FF9F67',
        backgroundColor: '#FF9F67'
      },
      {
        borderColor: '#30D8B6',
        backgroundColor: '#30D8B6'
      },
      {
        borderColor: '#F25E5E',
        backgroundColor: '#F25E5E'
      },
      {
        borderColor: '#4A73FB',
        backgroundColor: '#4A73FB'
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  constructor() { }

  ngOnInit(): void {
  }

  legendOnClick = (index) => {
    let ci = this.baseChart.chart;
    let alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      let meta = ci.getDatasetMeta(i);

      if (i == index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    ci.update();
  };

  setChartType(option) {
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
      // this.chart.chartLabels = ['11 Jul', '25 Jul', '8 Aug', '22 Aug', '5 Sep', '19 Sep'];
    }
  }
}
