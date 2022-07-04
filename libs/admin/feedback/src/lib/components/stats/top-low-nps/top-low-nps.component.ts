import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { feedback } from '../../../constants/feedback';
import {
  AdminUtilityService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { PerformanceNPS } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-top-low-nps',
  templateUrl: './top-low-nps.component.html',
  styleUrls: ['./top-low-nps.component.scss'],
})
export class TopLowNpsComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  tabfeedbackType: string;
  globalQueries;
  performanceNPS: PerformanceNPS;
  protected $subscription = new Subscription();
  keyLabels = feedback.keyLabels.topLow;
  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.tabFilterItems =
      this.globalFeedbackFilterType === feedback.types.stay ||
      this.globalFeedbackFilterType === feedback.types.both
        ? feedback.tabFilterItems.topLowNPS.stay
        : feedback.tabFilterItems.topLowNPS.transactional;
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    if (
      this.globalFeedbackFilterType === feedback.types.transactional ||
      this.globalFeedbackFilterType === feedback.types.both
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
        if (
          this.globalFeedbackFilterType !=
          data['filter'].value.feedback.feedbackType
        ) {
          this.globalFeedbackFilterType =
            data['filter'].value.feedback.feedbackType;
          this.tabfeedbackType = undefined;
          this.tabFilterItems =
            this.globalFeedbackFilterType === feedback.types.stay ||
            this.globalFeedbackFilterType === feedback.types.both
              ? feedback.tabFilterItems.topLowNPS.stay
              : feedback.tabFilterItems.topLowNPS.transactional;
        }
        this.setEntityId(data['filter'].value.feedback.feedbackType);
      })
    );
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this.statisticsService.outletIds },
      ];
    else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('hotelId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.hotelId },
          ];
        }
      });
    }
    this.getPerformanceNps();
  }

  listenForOutletChanged() {
    this.statisticsService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabFilterItems =
          response.type === feedback.types.transactional
            ? feedback.tabFilterItems.topLowNPS.transactional
            : feedback.tabFilterItems.topLowNPS.stay;
        this.tabfeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this.statisticsService.outletIds;
          }
        });
        this.getPerformanceNps();
      }
    });
  }

  progressItems = [];

  tabFilterItems;

  tabFilterIdx = 0;

  /**
   * @function getPerformanceNps To get the performance nps data.
   */
  getPerformanceNps(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          npsFilter: this.tabFilterItems[this.tabFilterIdx]?.value,
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    this.statisticsService.getNPSPerformance(config).subscribe(
      (response) => {
        this.performanceNPS = new PerformanceNPS().deserialize(response);
        // this.initData();
      },
      ({ error }) =>
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe()
    );
  }

  /**
   * @function onSelectedTabFilterChange To handle the tab change.
   * @param $event The Tab Chenge event.
   */
  onSelectedTabFilterChange($event: MatTabChangeEvent): void {
    this.tabFilterIdx = $event.index;
    this.getPerformanceNps();
  }

  get feedbackConfig() {
    return feedback;
  }

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === this.feedbackConfig.types.both
      ? feedback.types.transactional
      : this.tabfeedbackType;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
