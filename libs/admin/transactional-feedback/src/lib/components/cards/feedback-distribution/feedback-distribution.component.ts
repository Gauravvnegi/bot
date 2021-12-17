import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { FeedbackDistributionComponent as BaseFeedbackDistributionComponent } from '@hospitality-bot/admin/stay-feedback';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent
  extends BaseFeedbackDistributionComponent
  implements OnInit {
  constructor(
    statisticsService: StatisticsService,
    _globalFilterService: GlobalFilterService,
    _adminUtilityService: AdminUtilityService,
    _snackbarService: SnackBarService
  ) {
    super(
      statisticsService,
      _globalFilterService,
      _adminUtilityService,
      _snackbarService
    );
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          { outletsIds: this.statisticsService.outletIds },
        ];
        this.getFeedbackDistribution();
      })
    );
  }

  listenForOutletChanged() {
    this.statisticsService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this.statisticsService.outletIds,
        };
        this.getFeedbackDistribution();
      }
    });
  }
}
