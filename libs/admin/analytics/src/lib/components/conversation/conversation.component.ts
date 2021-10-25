import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
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
      responsive: true,
      cutoutPercentage: 0,
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
  stats = {
    totalResponse: 370,
    comparePercent: 10,
    data: [
      {
        label: 'Incoming',
        count: 146,
        color: '#ffec8c',
        comparePercent: 10,
      },
      {
        label: 'Outgoing',
        count: 255,
        color: '#31bb92',
        comparePercent: 10,
      },
    ],
  };
  constructor() {}

  ngOnInit(): void {
    this.initGraphData();
  }

  initGraphData(defaultGraph = false) {
    if (defaultGraph) {
      this.chart.Labels = ['No Data'];
      this.chart.Data = [[100]];
      this.chart.Colors[0] = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      return;
    }
    this.chart.Labels = [];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];

    this.stats.data.forEach((data) => {
      if (data.count) {
        this.chart.Labels.push(data.label);
        this.chart.Data[0].push(data.count);
        this.chart.Colors[0].backgroundColor.push(data.color);
        this.chart.Colors[0].borderColor.push(data.color);
      }
    });
  }
}
