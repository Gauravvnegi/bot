import { Component, OnInit, Input } from '@angular/core';
import { InhouseRequest } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-inhouse-request-statistics',
  templateUrl: './inhouse-request-statistics.component.html',
  styleUrls: ['./inhouse-request-statistics.component.scss'],
})
export class InhouseRequestStatisticsComponent implements OnInit {
  @Input() inhouseRequest: InhouseRequest;
  // totalRequest: number;
  requestPendingPercent: number;

  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',

    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
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
      responsive: true,
      elements: {
        center: {
          text: '401',
          text3: 'Total Users',
          fontColor: '#000',
          fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
          fontSize: 36,
          fontStyle: 'normal',
        },
      },
      cutoutPercentage: 0,
    },
  };

  constructor() {}

  ngOnInit(): void {
    //   this.setTotal();
    // this.setRequestPending();
    this.initGraphData();
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Data[0][0] = this.inhouseRequest.completed;
    this.chart.Data[0][1] = this.inhouseRequest.pending;
    this.chart.Data[0][2] = this.inhouseRequest.timeout;

    if (this.chart.Data[0].reduce((a, b) => a + b, 0)) {
      this.setChartOptions();
    } else {
      this.chart.Data = [[100]];
      this.chart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      this.chart.Labels = ['No data'];
    }
  }

  setChartOptions(): void {
    this.chart.Colors = [
      {
        backgroundColor: ['#52B33F', '#E0E0E0', '#CC052B'],
        borderColor: ['#52B33F', '#E0E0E0', '#CC052B'],
      },
    ];
    this.chart.Labels = [
      'Request Completed',
      'Request Pending',
      'Request Timeout',
    ];
  }
}
