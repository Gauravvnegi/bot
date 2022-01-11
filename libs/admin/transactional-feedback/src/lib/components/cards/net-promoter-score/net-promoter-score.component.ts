import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { NetPromoterScoreComponent as BaseNetPromoterScoreComponent } from '@hospitality-bot/admin/stay-feedback';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './net-promoter-score.component.scss',
  ],
})
export class NetPromoterScoreComponent extends BaseNetPromoterScoreComponent
  implements OnInit {
  constructor(
    fb: FormBuilder,
    _adminUtilityService: AdminUtilityService,
    _statisticService: StatisticsService,
    _globalFilterService: GlobalFilterService,
    _snackbarService: SnackBarService,
    dateService: DateService
  ) {
    super(
      fb,
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

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
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
          calenderType,
          { outletsIds: this._statisticService.outletIds },
        ];
        this.getNPSChartData();
      })
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
        this.getNPSChartData();
      }
    });
  }
}
