import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';
import { GlobalNpsComponent as BaseGlobalNpsComponent } from 'libs/admin/stay-feedback/src/lib/components/cards/global-nps/global-nps.component';

@Component({
  selector: 'hospitality-bot-global-nps',
  templateUrl: './global-nps.component.html',
  styleUrls: ['./global-nps.component.scss'],
})
export class GlobalNpsComponent extends BaseGlobalNpsComponent
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
        this.getGlobalNps();
      })
    );
  }

  listenForOutletChanged() {
    this.statisticsService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this.statisticsService.outletIds,
        };
        this.getGlobalNps();
      }
    });
  }
}
