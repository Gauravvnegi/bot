import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComplaintCategoryBreakDownStats } from '../../../models/complaint.analytics.model';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'complaint-breakdown',
  templateUrl: './complaint-breakdown.component.html',
  styleUrls: ['./complaint-breakdown.component.scss'],
})
export class ComplaintBreakdownComponent implements OnInit {
  label: string = 'Complaint Breakdown';
  complaintCategoryBreakDownStats: ComplaintCategoryBreakDownStats;
  $subscription = new Subscription();

  constructor(private AnalyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.$subscription.add(
      this.AnalyticsService.$complaintBreakDownStatsData.subscribe((res) => {
        if (res)
          this.complaintCategoryBreakDownStats =
            res.complaintCategoryBreakDownStats;
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
