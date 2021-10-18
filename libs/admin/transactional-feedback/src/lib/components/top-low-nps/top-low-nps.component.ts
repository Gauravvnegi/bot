import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';
import { TopLowNpsComponent as BaseTopLowNpsComponent } from 'libs/admin/stay-feedback/src/lib/components/top-low-nps/top-low-nps.component';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-top-low-nps',
  templateUrl: './top-low-nps.component.html',
  styleUrls: ['./top-low-nps.component.scss'],
})
export class TopLowNpsComponent extends BaseTopLowNpsComponent
  implements OnInit {
  tabFilterItems = [
    {
      label: 'Department',
      icon: '',
      value: 'DEPARTMENT',
      total: 0,
      isSelected: true,
    },
    {
      label: 'Experience',
      icon: '',
      value: 'EXPERIENCE',
      total: 0,
      isSelected: false,
    },
  ];
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
        this.getPerformanceNps();
      })
    );
  }

  listenForOutletChanged() {
    this.statisticsService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this.statisticsService.outletIds,
        };
        this.getPerformanceNps();
      }
    });
  }
}
