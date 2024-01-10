import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { SharedStats } from '../../../data-models/statistics.model';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-response-rate',
  templateUrl: './response-rate.component.html',
  styleUrls: ['./response-rate.component.scss'],
})
export class ResponseRateComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  tabFeedbackType: string;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: SharedStats;
  rateGraphFG: FormGroup;
  keyLabels = [
    { label: 'All', key: 'ALL' },
    { label: 'Whatsapp', key: 'WHATSAPP' },
    { label: 'Email', key: 'EMAIL' },
  ];
  entityType = 'ALL';
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
    options: chartConfig.options.shared,
  };
  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _dateService: DateService,
    protected _translateService: TranslateService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  /**
   * @function initFG Initializes the form group.
   */
  initFG(): void {
    this.rateGraphFG = this.fb.group({
      rategraph: ['ALL'],
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const calenderType = {
          calenderType: this._dateService.getCalendarType(
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
            { entityIds: this._statisticService.outletIds },
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

  /**
   * @function getStats To get the shared stat data.
   */
  getStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
          entityType: this.entityType,
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService.getSharedStats(config).subscribe((response) => {
        this.stats = new SharedStats().deserialize(response);
        this.initGraph(
          this.stats.feedbacks.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          ) === 0
        );
      })
    );
  }

  /**
   * @function initGraph To initialize the graph data.
   * @param defaultGraph The data status.
   */
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

    this.stats.feedbacks.map((data) => {
      if (data.count) {
        this.chart.labels.push(data.label);
        this.chart.data[0].push(data.count);
        this.chart.colors[0].backgroundColor.push(data.color);
        this.chart.colors[0].borderColor.push(data.color);
      }
    });
  }

  stopOpenModal(event) {
    event.stopPropagation();
  }

  /**
   * @function handleChannelChange Handles the channel dropdown value change.
   * @param event The material select change event.
   */
  handleRateGraphChange(event: MatSelectChange): void {
    this.entityType = event.value;
    this.getStats();
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

  openTableModal() {
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<FeedbackDatatableModalComponent> = {
      tableName: feedback.tableName.responseRate,
      tabFilterItems: this.createTabFilterItem(),
      tabFilterIdx: 0,
      globalFeedbackFilterType: this.globalFeedbackFilterType,
      config: [{ feedbackGraph: 'REQUESTED' }],
      feedbackType: this.getFeedbackType(),
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
    return this.stats.feedbacks.map((keyObj) => {
      return {
        label: keyObj.label,
        content: '',
        value: keyObj.key,
        disabled: false,
        total: 0,
        chips: feedback.chips.feedbackDatatable,
      };
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
