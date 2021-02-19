import { Component, OnInit } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'admin-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  managingOptions = [
    { label: 'Live Dashboard', url: 'assets/svg/dashboard-white.svg' },
    { label: 'Filters as per Journeys', url: 'assets/svg/Filter.svg' },
    { label: 'Analytics', url: 'assets/svg/analytics.svg' },
    {
      label: 'Live Request Handling',
      url: 'assets/svg/live-help.svg',
    },
    { label: 'Universal Search', url: 'assets/svg/search.svg' },
  ];

  constructor() {}

  ngOnInit(): void {}

  get currentDate() {
    return DateService.getCurrentDateWithFormat('YYYY');
  }
}
