import { Component, OnInit } from '@angular/core';
import { ComplaintBaseComponent } from '../complaint-analytics-base.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DateService } from '@hospitality-bot/shared/utils';
type HotelService = {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  minScore: number;
  maxScore: number;
  colorCode: string;
};
@Component({
  selector: 'complaint-breakdown',
  templateUrl: './complaint-breakdown.component.html',
  styleUrls: ['./complaint-breakdown.component.scss'],
})
export class ComplaintBreakdownComponent extends ComplaintBaseComponent
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
  label: string = 'Complaint Breakdown';

  getTransparentWidth(data) {
    return isNaN(data) ? 100 : Math.max(0, Math.min(100, 100 - (data ?? 0)));
  }
}
