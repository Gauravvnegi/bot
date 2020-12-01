import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-guest-status-statistics',
  templateUrl: './guest-status-statistics.component.html',
  styleUrls: ['./guest-status-statistics.component.scss']
})
export class GuestStatusStatisticsComponent implements OnInit {
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
      { data: [20, 25, 22, 30, 27, 45], label: 'New', fill: false, borderDash: [10, 5] },
      { data: [50, 65, 60, 75, 72, 80], label: 'Pre Check-In', fill: false },
      { data: [20, 28, 24, 35, 29, 55], label: 'Check-In', fill: false },
      { data: [50, 48, 60, 58, 65, 85], label: 'Checkout', fill: false, borderDash: [10, 5] },
    ],
    chartLabels: ['11 Jul', '25 Jul', '8 Aug', '22 Aug', '5 Sep', '19 Sep'],
    chartOptions: {
      responsive: true,
      elements: { 
        point: {
          radius: [0, 5 , 5, 5, 5, 5],
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
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
        borderColor: '#0239CF',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#F2509B',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#0239CF',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#F2509B',
        backgroundColor: '#FFFFFF',
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
      this.setChartColors();
    }
  }

  setChartColors() {
    if (this.chart.chartType === 'bar') {
      this.chart.chartColors = [
        {
          backgroundColor: '#0239CF',
        },
        {
          backgroundColor: '#288ad6',
        },
        {
          backgroundColor: '#F2509B',
        },
        {
          backgroundColor: '#F2809B',
        },
      ];
    } else {
      this.chart.chartColors = [
        {
          borderColor: '#0239CF',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#F2509B',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#0239CF',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#F2509B',
          backgroundColor: '#FFFFFF',
        },
      ];
    }
  }
}
