import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  sentReceivedChartData: {
    labels: string[];
    sent: number[];
    delivered: number[];
  } = {
    sent: new Array(24).fill(1),
    delivered: new Array(24).fill(2),
    labels: [
      '12AM',
      '1AM',
      '2AM',
      '3AM',
      '4AM',
      '5AM',
      '6AM',
      '7AM',
      '8AM',
      '9AM',
      '10AM',
      '11AM',
      '12PM',
      '1PM',
      '2PM',
      '3PM',
      '4PM',
      '5PM',
      '6PM',
      '7PM',
      '8PM',
      '9PM',
      '10PM',
      '11PM',
    ],
  };
  messageOverallAnalytics: MessageOverallAnalytic = {
    stat: [
      {
        today: 10,
        yesterday: 45,
        comparisonPercentage: 30,
        color: '#52B33F',
        label: 'Delivered',
        radius: 75,
        progress: 40,
        graphvalue: 75,
      },
      {
        today: 2,
        yesterday: 50,
        comparisonPercentage: 20,
        color: '#FFBF04',
        label: 'Sent',
        radius: 85,
        progress: 30,
        graphvalue: 75,
      },
      {
        today: 100,
        yesterday: 2000,
        comparisonPercentage: 40,
        color: '#4BA0F5',
        label: 'Read',
        radius: 65,
        progress: 50,
        graphvalue: 75,
      },
      {
        today: 0,
        yesterday: 10,
        comparisonPercentage: 50,
        color: '#CC052B',
        label: 'Failed',
        radius: 55,
        progress: 50,
        graphvalue: 75,
      },
    ],
    total: 0,
  };
  constructor() {}

  ngOnInit(): void {}
}

type MessageOverallAnalytic = {
  stat: {
    label: string;
    yesterday: number;
    today: number;
    graphvalue: number;
    comparisonPercentage: number;
    color: string;
    radius: number;
    progress: number;
  }[];
  total: number;
};
