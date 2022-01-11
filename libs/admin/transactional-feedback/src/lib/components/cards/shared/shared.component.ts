import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SharedComponent as BaseSharedComponent } from '@hospitality-bot/admin/stay-feedback';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
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
    _dateService: DateService,
    _translateService: TranslateService
  ) {
    super(
      _adminUtilityService,
      _statisticService,
      _globalFilterService,
      _snackbarService,
      _dateService,
      _translateService
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
            calenderType: this._dateService.getCalendarType(
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
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  listenForOutletChanged() {
    this._statisticService.outletChange.subscribe((response) => {
      if (response) {
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('outletsIds')) {
            element.outletsIds = this._statisticService.outletIds;
          }
        });
        this.getStats();
      }
    });
  }
}
