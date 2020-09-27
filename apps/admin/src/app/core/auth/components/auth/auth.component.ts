import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  managingOptions;

  constructor() {}

  ngOnInit(): void {
    this.managingOptions = [
      { label: 'Live Dashboard', icon: 'dashboard', url: '' },
      { label: 'Filters as per Journeys', icon: 'filter', url: '' },
      { label: 'Analytics', icon: '', url: 'assets/svg/analytics.svg' },
      {
        label: 'Live Request Handling',
        icon: '',
        url: 'assets/svg/live-help.svg',
      },
      { label: 'Universal Search', icon: '', url: 'assets/svg/search.svg' },
    ];
  }
}
