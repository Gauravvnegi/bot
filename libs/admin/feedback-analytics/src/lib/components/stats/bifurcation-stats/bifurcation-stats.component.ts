import { Component, Input, OnInit } from '@angular/core';
import { Bifurcation } from '../../../data-models/statistics.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
  StatCard,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { feedback } from '../../../constants/feedback';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { Subscription, forkJoin } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';

@Component({
  selector: 'hospitality-bot-bifurcation-stats',
  templateUrl: './bifurcation-stats.component.html',
  styleUrls: ['./bifurcation-stats.component.scss'],
})
export class BifurcationStatsComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;

  feedback = [];
  stats: Bifurcation;
  bifurcationFG: FormGroup;

  noActionCount = 0;
  gtmCount = 0;
  othersCount = 0;

  loading = false;
  entityType = 'GTM';
  tabFeedbackType: string;
  $subscription = new Subscription();
  selectedInterval: string;
  globalQueries = [];
  statCard: StatCard[] = [];

  chart: CircularChart = {
    labels: [],
    data: [[]],
    type: chartConfig.type.doughnut,
    legend: false,
    colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    options: chartConfig.options.feedback,
  };

  keyLabels = [
    { label: 'GTM', value: 'GTM' },
    { label: 'ALL', value: 'ALL' },
    { label: 'Other Depts', value: 'OTHERS' },
  ];
  feedbackConfig = feedback;

  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected dateService: DateService,
    protected _translateService: TranslateService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG(): void {
    this.bifurcationFG = this.fb.group({
      bifurcation: ['ALL'],
    });
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
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        )
          this.globalQueries = [
            ...this.globalQueries,
            {
              entityIds: this._statisticService.outletIds,
            },
          ];
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getStats();
      })
    );
  }

  setEntityId(feedbackType) {
    if (feedbackType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
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
    this._statisticService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabFeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this._statisticService.outletIds;
          }
        });
        this.getStats();
      }
    });
  }

  getConfig(type: string) {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
          entityType: type,
        },
      ]),
    };
    return config;
  }

  getStats(): void {
    this.loading = true;
    const gtmStats$ = this._statisticService.getBifurcationStats(
      this.getConfig('GTM')
    );
    const allStats$ = this._statisticService.getBifurcationStats(
      this.getConfig('ALL')
    );
    const othersResponse$ = this._statisticService.getBifurcationStats(
      this.getConfig('OTHERS')
    );
    this.$subscription.add(
      forkJoin([gtmStats$, allStats$, othersResponse$]).subscribe(
        ([gtmResponse, allResponse, othersResponse]) => {
          // Process GTM stats
          this.getGTMStats(gtmResponse);
          // Process all stats
          this.getAllStats(allResponse);
          this.getOtherStats(othersResponse);
          this.initGraph(
            this.feedback.reduce(
              (accumulator, current) => accumulator + +current.score,
              0
            ) === 0
          );
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function getStats To get received feedback bifurcation data.
   */
  getGTMStats(response): void {
    this.statCard = [];
    this.gtmCount = 0;
    this.stats = new Bifurcation().deserialize(response);
    this.gtmCount = this.stats.totalCount;
    this.stats.feedbacks.forEach((feedback) => {
      const gtmStatCard: StatCard = {
        label: feedback.label,
        score: feedback.score.toString(),
        additionalData: feedback.score.toString(),
        comparisonPercent: 100,
        color: feedback.color,
      };
      if (feedback.label === 'Timeout') gtmStatCard.label = 'Timed-out';
      this.statCard.push(gtmStatCard);
    });
  }

  getAllStats(response) {
    this.feedback = [];
    this.noActionCount = 0;
    const allStats = new Bifurcation().deserialize(response);
    allStats.feedbacks.forEach((feedback) => {
      if (feedback.label === 'No-Action') {
        this.feedback.push({
          label: 'Positive Experience',
          score: feedback.score.toString(),
          additionalData: feedback.score.toString(),
          color: '#beaeff',
          comparisonPercent: 100,
        });
        this.noActionCount += feedback.score;
      }
    });
    this.feedback.push({
      label: 'Negative Experience',
      score: this?.gtmCount,
      additionalData: this?.gtmCount,
      color: '#5f38f9',
      comparisonPercent: 100,
    });
  }

  getOtherStats(response) {
    this.feedback.push({
      label: 'Other Depts',
      score: response.totalCount,
      additionalData: response.totalCount,
      color: 'rgb(197, 197, 197)',
      comparisonPercent: 100,
    });
    this.othersCount = response.totalCount;
  }

  initGraph(defaultGraph = true): void {
    this.chart.labels = [];
    this.chart.data = [[]];
    this.chart.colors = [
      {
        backgroundColor: [],
        borderColor: [],
      },
    ];
    if (defaultGraph) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => this.chart.labels.push(message));
      this.chart.data[0].push(100);
      this.chart.colors[0].backgroundColor.push(chartConfig.defaultColor);
      this.chart.colors[0].borderColor.push(chartConfig.defaultColor);
      return;
    }
    this.feedback.map((data) => {
      this.chart.labels.push(data.label);
      this.chart.data[0].push(data.score);
      this.chart.colors[0].backgroundColor.push(data.color);
      this.chart.colors[0].borderColor.push(data.color);
    });
  }

  getFeedbackType() {
    if (this.tabFeedbackType === undefined) {
      return this.globalFeedbackFilterType === feedback.types.both
        ? feedback.types.stay
        : this.globalFeedbackFilterType;
    }
    return this.tabFeedbackType === feedback.types.both
      ? ''
      : this.tabFeedbackType;
  }

  openTableModal(event) {
    event.stopPropagation();
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<FeedbackDatatableModalComponent> = {
      data: {
        tableName: feedback.tableName.receivedBreakdown,
        tabFilterItems: this.createTabFilterItem(),
        tabFilterIdx: this.keyLabels.findIndex((item) => item.value === 'ALL'),
        globalFeedbackFilterType: this.globalFeedbackFilterType,
        config: [{ feedbackGraph: 'BIFURCATIONS' }],
        feedbackType: this.getFeedbackType(),
      },
    };
    dialogRef = openModal({
      config: {
        width: '80%',
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
        value: keyObj.value,
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
