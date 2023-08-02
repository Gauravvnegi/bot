import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'complaint-analytics',
  templateUrl: './complaint-analytics.component.html',
  styleUrls: ['./complaint-analytics.component.scss'],
})
export class ComplaintAnalyticsComponent implements OnInit {
  welcomeMessage = 'Welcome To Complaint Analytics';
  navRoutes = [{ label: 'Complaint Analytics', link: './' }];
  $subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {}
}
