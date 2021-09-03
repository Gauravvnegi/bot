import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-overall-received-bifurcation',
  templateUrl: './overall-received-bifurcation.component.html',
  styleUrls: ['./overall-received-bifurcation.component.scss'],
})
export class OverallReceivedBifurcationComponent implements OnInit {
  overallReceivedBifurcation = {
    stat: [
      {
        radius: 55,
        progress: 80,
        color: '#52B33F',
        label: 'Closed',
        today: 0,
        yesterday: 0,
        comparisonPercentage: 100,
        strokeWidth: 3,
        polygon: 'assets/svg/Polygon_closed.svg',
      },
      {
        radius: 65,
        progress: 20,
        color: '#4BA0F5',
        label: 'Action Pending',
        today: 0,
        yesterday: 0,
        comparisonPercentage: 100,
        strokeWidth: 4,
        polygon: 'assets/svg/Polygon_pending.svg',
      },
      {
        radius: 75,
        progress: 30,
        color: '#CC052B',
        label: 'Unread',
        today: 0,
        yesterday: 0,
        comparisonPercentage: 100,
        strokeWidth: 5,
        polygon: 'assets/svg/Polygon_unread.svg',
      },
      {
        radius: 85,
        progress: 100,
        color: '#FFBF04',
        label: 'Received',
        today: 0,
        yesterday: 0,
        comparisonPercentage: 100,
        strokeWidth: 6,
        polygon: 'assets/svg/Polygon.svg',
      },
    ],
    total: 0,
  };

  constructor() {}

  ngOnInit(): void {}
}
