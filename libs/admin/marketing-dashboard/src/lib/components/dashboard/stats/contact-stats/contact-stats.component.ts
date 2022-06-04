import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-contact-stats',
  templateUrl: './contact-stats.component.html',
  styleUrls: ['./contact-stats.component.scss'],
})
export class ContactStatsComponent implements OnInit {
  contactValue = [
    {
      graphvalue: 75,
      label: 'TESTING',
      radius: 75,
      color: '#52B33F',
      progress: 65,
    },
    {
      graphvalue: 75,
      label: 'TESTING2',
      radius: 85,
      color: '#FF8F00',
      progress: 35,
    },
    {
      graphvalue: 75,
      label: 'TESTING3',
      radius: 95,
      color: '#CC052B',
      progress: 85,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
