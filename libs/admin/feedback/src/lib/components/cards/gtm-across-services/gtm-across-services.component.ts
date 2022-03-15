import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  StatisticsService,
  AdminUtilityService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';

@Component({
  selector: 'hospitality-bot-gtm-across-services',
  templateUrl: './gtm-across-services.component.html',
  styleUrls: ['./gtm-across-services.component.scss'],
})
export class GtmAcrossServicesComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  tabfeedbackType: string;
  $subscription = new Subscription();
  feedbackConfig = feedback;
  globalQueries = [];
  progress = 0;
  statistics;
  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    if (
      this.globalFeedbackFilterType ===
        this.feedbackConfig.types.transactional ||
      this.globalFeedbackFilterType === this.feedbackConfig.types.both
    )
      this.listenForOutletChanged();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getGTMAcrossService();
      })
    );
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
    else if (feedbackType === feedback.types.both) {
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          if (
            !this.globalQueries[
              this.globalQueries.length - 1
            ].entityIds.includes(element.hotelId)
          )
            this.globalQueries[this.globalQueries.length - 1].entityIds.push(
              element.hotelId
            );
        }
      });
    } else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.hotelId },
          ];
        }
      });
    }
  }

  listenForOutletChanged() {
    this.statisticsService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabfeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this.statisticsService.outletIds;
          }
        });
        this.getGTMAcrossService();
      }
    });
  }

  setProgress() {
    if (this.statistics?.gtmStatData.REMAINING) {
      this.progress = Math.abs(
        (this.statistics?.gtmStatData.CLOSED /
          this.statistics?.gtmStatData.REMAINING) *
          100
      );
    } else {
      this.progress = 0;
    }
  }

  getGTMAcrossService() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };

    this.$subscription.add(
      this.statisticsService
        .getGTMAcrossServices(config)
        .subscribe((response) => {
          this.statistics = response;
          this.setProgress();
        })
    );
  }

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? ''
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === this.feedbackConfig.types.both
      ? ''
      : this.tabfeedbackType;
  }
}
