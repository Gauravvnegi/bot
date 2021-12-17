import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SharedComponent as BaseSharedComponent } from '@hospitality-bot/admin/stay-feedback';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss'],
})
export class SharedComponent extends BaseSharedComponent implements OnInit {
  constructor(
    _adminUtilityService: AdminUtilityService,
    _statisticService: StatisticsService,
    _globalFilterService: GlobalFilterService,
    _snackbarService: SnackBarService,
    dateService: DateService
  ) {
    super(
      _adminUtilityService,
      _statisticService,
      _globalFilterService,
      _snackbarService,
      dateService
    );
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe(
        (data) => {
          let calenderType = {
            calenderType: this.dateService.getCalendarType(
              data['dateRange'].queryValue[0].toDate,
              data['dateRange'].queryValue[1].fromDate,
              this._globalFilterService.timezone
            ),
          };
          this.selectedInterval = calenderType.calenderType;
          this.globalQueries = [
            ...data['filter'].queryValue,
            ...data['dateRange'].queryValue,
            { outletsIds: this._statisticService.outletIds },
            calenderType,
          ];
          this.getStats();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  listenForOutletChanged() {
    this._statisticService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries[this.globalQueries.length - 1] = {
          outletsIds: this._statisticService.outletIds,
        };
        this.getStats();
      }
    });
  }
}
