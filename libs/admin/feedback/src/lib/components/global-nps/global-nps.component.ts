import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-global-nps',
  templateUrl: './global-nps.component.html',
  styleUrls: ['./global-nps.component.scss'],
})
export class GlobalNpsComponent implements OnInit {
  globalNps = {
    totalCount: 86,
    negative: 50,
    neutral: 5,
    positive: 45
  };

  chart: any = {
    Labels: ['Neutral', 'Positive', 'Negative'],
    Data: [[5, 45, 50]],
    Type: 'doughnut',

    Legend: false,
    Colors: [
      {
        backgroundColor: ['#4BA0F5', '#1AB99F', '#EF1D45'],
        borderColor: ['#4BA0F5', '#1AB99F', '#EF1D45'],
      },
    ],
    Options: {
      responsive: true,
      cutoutPercentage: 0,
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
