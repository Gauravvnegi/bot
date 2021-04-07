import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-users-usage',
  templateUrl: './users-usage.component.html',
  styleUrls: ['./users-usage.component.scss'],
})
export class UsersUsageComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dateService: DateService
  ) {}

  // chartTypes = [
  //   {
  //     name: 'Bar',
  //     value: 'bar',
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
        data: [5, 5, 7, 9, 12],
        label: 'Total Users',
      },
    ],
    chartLabels: ['02 Feb', '09 Feb', '16 Feb', '23 Feb', '02 Mar'],
    chartOptions: {
      responsive: true,
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
              // stepSize: 1,
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
    chartType: 'bar',
  };

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
      // if (
      //   this.chart.chartOptions.scales.yAxes[0].ticks.stepSize <
      //   data.value / this.chartData.length
      // ) {
      //   this.chart.chartOptions.scales.yAxes[0].ticks.stepSize = Number(
      //     data.value / this.chartData.length
      //   );
      // }
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels('date', data.label, 'DD MMM')
      );
    });
  }

  setChartType(option, event): void {
    event.stopPropagation();
    this.chart.chartType = option.value;
    this.chart.chartColors[0].backgroundColor = option.backgroundColor;
  }

  openRolesPermission(event) {
    event.stopPropagation();
    this.router.navigate(['/pages/roles-permissions']);
  }
}
