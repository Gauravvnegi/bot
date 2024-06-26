import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { FeedbackDistribution } from '../../../data-models/statistics.model';
import { TranslateService } from '@ngx-translate/core';
import { chartConfig } from '../../../constants/chart';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  tabFeedbackType: string;
  feedbackConfig = feedback;
  globalQueries;
  $subscription = new Subscription();
  totalDistribution = 0;
  color = feedback.colorConfig.distribution;

  chart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.type.doughnut,
    legend: false,
    colors: chartConfig.colors.distribution,
    options: chartConfig.options.distribution,
  };

  keyLabels = [];
  loading = false;

  distribution: FeedbackDistribution;
  constructor(
    protected statisticsService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    private dialogService: DialogService
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
        this.getFeedbackDistribution();
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
        this.getFeedbackDistribution();
      }
    });
  }

  /**
   * @function initChartData Initializes the graph data.
   */
  initChartData(): void {
    this.totalDistribution = 0;
    this.keyLabels.length = this.chart.data[0].length = this.chart.labels.length = this.chart.colors[0].backgroundColor.length = this.chart.colors[0].borderColor.length = 0;
    this.distribution.data.map((data) => {
      if (data.count) {
        this.chart.labels.push(data.label);
        this.chart.data[0].push(data.count);
        this.chart.colors[0].backgroundColor.push(data.color);
        this.chart.colors[0].borderColor.push(data.color);
      }
      this.totalDistribution += data.count;
      this.keyLabels.push({
        ...data,
        color: data.color,
      });
    });
    if (!this.chart.data[0].length) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => (this.chart.labels = [message]));
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      this.chart.data = [[100]];
    }
  }

  /**
   * @function getFeedbackDistribution gets the feedback distribution stats from api.
   */
  getFeedbackDistribution() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    this.statisticsService.feedbackDistribution(config).subscribe(
      (response) => {
        this.loading = false;
        this.distribution = new FeedbackDistribution().deserialize(response);
        this.initChartData();
      },
      ({ error }) => {
        this.loading = false;
      }
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
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<FeedbackDatatableModalComponent> = {
      data: {
        tableName: feedback.tableName.distribution,
        tabFilterItems: this.createTabFilterItem(),
        tabFilterIdx: 0,
        globalFeedbackFilterType: this.globalFeedbackFilterType,
        config: [{ feedbackGraph: 'DISTRIBUTION' }],
        feedbackType: this.getFeedbackType(),
      },
    };
    dialogRef = openModal({
      config: {
        width: '80%',
        styleClass: 'dynamic-modal',
        data: modalData,
      },
      component: FeedbackDatatableModalComponent,
      dialogService: this.dialogService,
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
