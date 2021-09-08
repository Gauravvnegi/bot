import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-overall-received-bifurcation',
  templateUrl: './overall-received-bifurcation.component.html',
  styleUrls: ['./overall-received-bifurcation.component.scss'],
})
export class OverallReceivedBifurcationComponent implements OnInit {
  feedbackChart = {
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
      responsive: true,
      cutoutPercentage: 75,
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
    },
  };

  negativeFeedbackChart: any = {
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
      responsive: true,
      cutoutPercentage: 75,
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
    },
  };
  constructor() {}

  ngOnInit(): void {
    this.initFeedbackChart();
    this.initNegativeFeedbackChart();
  }

  initFeedbackChart() {
    this.feedbackChart.Data = [[54, 84]];
    this.feedbackChart.Labels = ['Positive', 'Negative'];
    this.feedbackChart.Colors = [
      {
        backgroundColor: ['#52b33f', '#cc052b'],
        borderColor: ['#52b33f', '#cc052b'],
      },
    ];
  }

  initNegativeFeedbackChart() {
    this.negativeFeedbackChart.Data = [[44, 73]];
    this.negativeFeedbackChart.Labels = ['Action Pending', 'Closed'];
    this.negativeFeedbackChart.Colors = [
      {
        backgroundColor: ['#ffbf04', '#4ba0f5'],
        borderColor: ['#ffbf04', '#4ba0f5'],
      },
    ];
  }
}
