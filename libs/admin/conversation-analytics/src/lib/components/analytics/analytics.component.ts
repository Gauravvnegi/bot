import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  welcomeMessage = 'Welcome To Analytics';
  navRoutes = [{ label: 'Freddie Analytics', link: './' }];
  constructor() {}

  ngOnInit(): void {}
}
