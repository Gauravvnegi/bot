import { Component, OnInit } from '@angular/core';
import { ComplaintBaseComponent } from '../complaint-analytics-base.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';

@Component({
  selector: 'complaint-disengagement',
  templateUrl: './complaint-disengagement.component.html',
  styleUrls: ['./complaint-disengagement.component.scss'],
})
export class ComplaintDisengagementComponent extends ComplaintBaseComponent
  implements OnInit {
  constructor(
    analyticsService: AnalyticsService,
    adminUtilityService: AdminUtilityService,
    globalFilterService: GlobalFilterService,
    dateService: DateService
  ) {
    super(
      analyticsService,
      adminUtilityService,
      globalFilterService,
      dateService
    );
  }
}
