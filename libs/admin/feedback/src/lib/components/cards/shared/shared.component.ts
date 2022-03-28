import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  CircularChart,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { SharedStats } from '../../../data-models/statistics.model';
import { FeedbackDatatableModalComponent } from '../../modals/feedback-datatable/feedback-datatable.component';

@Component({
  selector: 'hospitality-bot-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss'],
})
export class SharedComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  tabfeedbackType: string;
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: SharedStats;
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
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _dateService: DateService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService
  ) {}

  ngOnInit(): void {
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
    else if (feedbackType === feedback.types.both) {
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
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
    this._statisticService.$outletChange.subscribe((response) => {
      if (response.status) {
        this.tabfeedbackType = response.type;
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

  getFeedbackType() {
    if (this.tabfeedbackType === undefined) {
      return this.globalFeedbackFilterType === feedback.types.both
        ? ''
        : this.globalFeedbackFilterType;
    }
    return this.tabfeedbackType === feedback.types.both
      ? ''
      : this.tabfeedbackType;
  }

  openTableModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    dialogConfig.data = {
      tableName: 'Response Rate',
      tabFilterItems: this.createTabFilterItem(),
      tabFilterIdx: 0,
      globalFeedbackFilterType: this.globalFeedbackFilterType,
      config: [{ feedbackGraph: 'REQUESTED' }],
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
