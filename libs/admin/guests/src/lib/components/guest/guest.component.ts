import { Component, OnInit } from '@angular/core';
import {
  ModuleNames,
  NavRouteOptions,
  TableNames,
} from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
})
export class GuestComponent implements OnInit {
  welcomeMessage = 'Welcome To Your Dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Guest Dashboard', link: './' }];
  constructor() {}

  ngOnInit(): void {}

  get featurePath() {
    return [`${ModuleNames.GUESTS_DASHBOARD}.tables.${TableNames.GUEST}`];
  }
}
