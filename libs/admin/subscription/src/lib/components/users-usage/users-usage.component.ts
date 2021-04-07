import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-users-usage',
  templateUrl: './users-usage.component.html',
  styleUrls: ['./users-usage.component.scss'],
})
export class UsersUsageComponent implements OnInit {
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
              callback: function (value) {
                return AdminUtilityService.valueFormatter(value, 2);
              },
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

  constructor(private router: Router, private dateService: DateService) {}

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
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels('date', data.label, 'DD MMM')
      );
    });
  }

  openRolesPermission(event) {
    event.stopPropagation();
    this.router.navigate(['/pages/roles-permissions']);
  }
}
