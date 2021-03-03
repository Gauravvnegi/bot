import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-users-usage',
  templateUrl: './users-usage.component.html',
  styleUrls: ['./users-usage.component.scss'],
})
export class UsersUsageComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  chartTypes = [
    {
      name: 'Bar',
      value: 'bar',
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
        data: [5, 5, 7, 9, 12],
        label: 'Total Users',
      },
    ],
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
              max: 14,
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

  ngOnInit(): void {}

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
