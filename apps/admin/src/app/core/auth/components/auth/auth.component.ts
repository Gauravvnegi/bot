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
      { label: 'Live Dashboard', icon: 'dashboard' },
      { label: 'Filters as per Journeys', icon: 'filter' },
      { label: 'Dashboard', icon: 'dashboard' },
      { label: 'Dashboard', icon: 'dashboard' },
      { label: 'Dashboard', icon: 'dashboard' },
    ];
  }
}
