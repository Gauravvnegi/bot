import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { GTM } from '../../../data-models/statistics.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';
import { StatisticsService } from '../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-gtm-across-services',
  templateUrl: './gtm-across-services.component.html',
  styleUrls: ['./gtm-across-services.component.scss'],
})
export class GtmAcrossServicesComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  tabFeedbackType: string;
  $subscription = new Subscription();
  feedbackConfig = feedback;
  globalQueries = [];
  progress = 0;
  statistics: GTM;
  keyLabels = [];

  constructor(
    protected statisticsService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
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
    else {
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('entityId')) {
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: element.entityId },
          ];
        }
      });
    }
  }

  listenForOutletChanged() {
    this.statisticsService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabFeedbackType = response.type;
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
    if (this.statistics?.REMAINING) {
      this.progress = Math.abs(
        (this.statistics?.CLOSED /
          (this.statistics?.REMAINING + this.statistics?.CLOSED)) *
          100
      );
    } else if (this.statistics.REMAINING === 0 && this.statistics.CLOSED) {
      this.progress = 100;
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
          this.statistics = new GTM().deserialize(response);
          this.keyLabels = [
            { label: 'Resolved', key: 'CLOSED' },
            { label: 'Remaining', key: 'REMAINING' },
          ];
          this.setProgress();
        })
    );
  }

  getFeedbackType() {
    if (this.tabFeedbackType === undefined) {
      return this.globalFeedbackFilterType === this.feedbackConfig.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabFeedbackType === this.feedbackConfig.types.both
      ? feedback.types.transactional
      : this.tabFeedbackType;
  }

  openTableModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    dialogConfig.data = {
      tableName: 'Feedback GTM across services',
      tabFilterItems: this.createTabFilterItem(),
      tabFilterIdx: 0,
      globalFeedbackFilterType: this.globalFeedbackFilterType,
      config: [{ feedbackGraph: 'GUESTTOMEET' }],
      feedbackType: this.getFeedbackType(),
    };
    const detailCompRef = this._modalService.openDialog(
      FeedbackDatatableModalComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }

  createTabFilterItem() {
    return this.keyLabels.map((keyObj) => {
      return {
        label: keyObj.label,
        content: '',
        value: keyObj.key,
        disabled: false,
        total: 0,
        chips: this.feedbackConfig.chips.feedbackDatatable,
      };
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
