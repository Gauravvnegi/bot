import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'hospitality-bot-create-with-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/dashboard`;

  constructor() {}

  ngOnInit(): void {}
}
