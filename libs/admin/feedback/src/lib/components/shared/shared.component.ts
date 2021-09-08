import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss'],
})
export class SharedComponent implements OnInit {
  chart: any = {
    Labels: ['Not Received', 'Received'],
    Data: [[100, 180]],
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#FFEC8C', '#31BB92'],
        borderColor: ['#FFEC8C', '#31BB92'],
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
  constructor() {}

  ngOnInit(): void {}
}
