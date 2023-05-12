import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { Bifurcation } from '../../../data-models/statistics.model';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';
import { MatSelectChange } from '@angular/material/select';
import { StatisticsService } from '../../../services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-received-breakdown',
  templateUrl: './received-breakdown.component.html',
  styleUrls: ['./received-breakdown.component.scss'],
})
export class ReceivedBreakdownComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  entityType = 'GTM';
  tabFeedbackType: string;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  progress=0;
  stats: Bifurcation;
  bifurcationFG: FormGroup;
  keyLabels = [
    { label: 'GTM', key: 'GTM' },
    { label: 'ALL', key: 'ALL' },
    { label: 'Others', key: 'OTHERS' }
  ];
  timeout: number;
  timeoutColor: string;
  total: number;
  feedbackChart = {
    Labels: [],
    Data: [[]],
    Type: chartConfig.type.doughnut,
    Legend: false,
    Colors: [
      {
        backgroundColor: [chartConfig.defaultColor],
        borderColor: [chartConfig.defaultColor],
      },
    ],
    Options: chartConfig.options.distribution,
  };
  feedbackConfig = feedback;

  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected dateService: DateService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  /**
   * @function initFG Initializes the form group.
   */
  initFG(): void {
    this.bifurcationFG = this.fb.group({
      bifurcation: ['GTM'],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForReadStatusChange();
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

  stopOpenModal(event) {
    event.stopPropagation();
  }
  /**
   * @function handleChannelChange Handles the channel dropdown value change.
   * @param event The material select change event.
   */
  handleBifurcationChange(event: MatSelectChange): void {
    this.entityType = event.value;
    this.getStats();
  }
  listenForReadStatusChange() {
    this.$subscription.add(
      this._statisticService.markReadStatusChanged.subscribe((response) => {
        if (response) this.getStats();
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
   * @function getStats To get received feedback bifurcation data.
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
      this._statisticService
        .getBifurcationStats(config)
        .subscribe((response) => {
          this.stats = new Bifurcation().deserialize(response);
          this.stats.feedbacks.forEach((feedback) => {
            if (feedback.label === 'Timeout') {
              this.timeout = feedback.score;
              this.timeoutColor = feedback.color;
            }
          });
          this.total = this.stats.totalCount;
          this.initFeedbackChart(
            this.stats.feedbacks
            .filter((feedback) => feedback.label !== 'Timeout')
            .reduce(
              (accumulator, current) => accumulator + current.score, 0
            ) === 0
            );
          this.setProgress();
        })
    );
  }

  setProgress(){
    if(this.timeout){
      this.progress = Math.abs(
        (this.timeout/
        this.total) *100
      )
    }else if(this.timeout === 0 && this.total){
      this.progress = 100;
    }
    else{
      this.progress = 0;
    }
  }

  /**
   * @function initFeedbackChart To initialize chart data.
   * @param defaultGraph The data status.
   */
  initFeedbackChart(defaultGraph: boolean): void {
    console.log(defaultGraph);
    this.feedbackChart.Data[0].length = this.feedbackChart.Labels.length = this.feedbackChart.Colors[0].backgroundColor.length = this.feedbackChart.Colors[0].borderColor.length = 0;
    if (defaultGraph) {
      this._translateService
        .get('no_data_chart')
        .subscribe((message) => (this.feedbackChart.Labels = [message]));
      this.feedbackChart.Colors[0].backgroundColor.push(
        chartConfig.defaultColor
      );
      this.feedbackChart.Colors[0].borderColor.push(chartConfig.defaultColor);
      this.feedbackChart.Data = [[100]];
      return;
    }
    const data = this.stats.feedbacks.filter((feedback) => feedback.label !== 'Timeout');
    data.map((feedback) => {
      if (feedback.score) {
        this.feedbackChart.Data[0].push(feedback.score);
        this.feedbackChart.Labels.push(feedback.label);
        this.feedbackChart.Colors[0].backgroundColor.push(feedback.color);
        this.feedbackChart.Colors[0].borderColor.push(feedback.color);
      }
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    dialogConfig.data = {
      tableName: feedback.tableName.receivedBreakdown,
      tabFilterItems: this.createTabFilterItem(),
      tabFilterIdx: this.keyLabels.findIndex(
        (item) => item.key === this.entityType
      ),
      globalFeedbackFilterType: this.globalFeedbackFilterType,
      config: [{ feedbackGraph: 'BIFURCATIONS' }],
      feedbackType: this.getFeedbackType(),
    };
    const detailCompRef = this._modalService.openDialog(
      FeedbackDatatableModalComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
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
