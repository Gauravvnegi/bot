import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { get } from 'lodash';

@Component({
  selector: 'hospitality-bot-guest-usage',
  templateUrl: './guest-usage.component.html',
  styleUrls: ['./guest-usage.component.scss'],
})
export class GuestUsageComponent implements OnInit {
  @Input() data;
  @Input() chartData;
  subscriptionData;
  chart: any = {
    chartData: {
      datasets: [
        { data: [7000, 7000, 9000, 11000, 14000], label: 'Usage' },
        { data: [5000, 5000, 7000, 9000, 12000], label: 'Limit' },
      ],
      // data: [5, 5, 7, 9, 12],
      label: 'Total Users',
    },

    chartLabels: ['02 Feb', '09 Feb', '16 Feb', '23 Feb', '02 Mar'],
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

  constructor(
    private dateService: DateService,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.subscriptionData = this.subscriptionService.getModuleSubscription();
    this.initChart();
    console.log(this.data);
  }

  initChart() {
    this.chart.chartData.datasets[0].data = [];
    this.chart.chartData.datasets[1].data = [];
    this.chart.chartLabels = [];
    let limit =
      get(this.subscriptionData, ['features', 'MODULE'])?.filter(
        (data) => data.name === 'GUESTS'
      )[0]?.cost?.usageLimit || 0;
    this.chartData.forEach((data) => {
      this.chart.chartData.datasets[1].data.push(limit);
      this.chart.chartData.datasets[0].data.push(data.value);
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels('date', data.label, 'DD MMM')
      );
    });
  }

  format(value) {
    return AdminUtilityService.valueFormatter(value, 2);
  }
}
