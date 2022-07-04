import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BarChart,
  sharedConfig,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { chartConfig } from '../../../constants/chart';
import { feedback } from '../../../constants/feedback';
import { NPS } from '../../../data-models/statistics.model';
import { FeedbackTableService } from '../../../services/table.service';
import { ChartTypeOption } from '../../../types/feedback.type';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './net-promoter-score.component.scss',
  ],
})
export class NetPromoterScoreComponent implements OnInit, OnDestroy {
  @Input() globalFeedbackFilterType: string;
  tabfeedbackType: string;
  feedbackConfig = feedback;
  npsFG: FormGroup;
  documentTypes = [{ label: 'CSV', value: 'csv' }];
  $subscription = new Subscription();
  selectedInterval: string;
  npsChartData: NPS;
  globalQueries = [];
  chartTypes = [feedback.chartType.bar, feedback.chartType.line];

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  chart: BarChart = {
    data: [
      {
        fill: true,
        data: [''],
        label: 'Overall NPS',
      },
    ],
    labels: [''],
    options: chartConfig.options.nps,
    colors: chartConfig.colors.nps,
    legend: false,
    type: chartConfig.type.line,
  };

  public barColor: any[] = [
    {
      backgroundColor: [],
    },
  ];

  constructor(
    protected fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService,
    protected tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.initFG();
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
        const calenderType = {
          calenderType: this.tableService.getCalendarTypeNPS(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this._globalFilterService.timezone
          ),
        };
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.setEntityId(data['filter'].value.feedback.feedbackType);
        this.getNPSChartData();
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
        this.tabfeedbackType = response.type;
        this.globalQueries.forEach((element) => {
          if (element.hasOwnProperty('entityIds')) {
            element.entityIds = this._statisticService.outletIds;
          }
        });
        this.getNPSChartData();
      }
    });
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All'],
      npsChartType: ['line'],
    });
  }

  /**
   * @function setChartType To set the chart type option.
   * @param option The chart type option.
   */
  setChartType(option: ChartTypeOption): void {
    this.chart.type = option.value;
    this.chart.colors[0].backgroundColor = option.backgroundColor;
  }

  /**
   * @function initGraphData To initialize the graph data.
   */
  protected initGraphData(): void {
    const botKeys = Object.keys(this.npsChartData.npsGraph);
    this.chart.data[0].data = [];
    this.chart.labels = [];
    this.barColor[0].backgroundColor = [];
    botKeys.forEach((d, i) => {
      this.chart.labels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
          this._globalFilterService.timezone,
          this.getFormatForlabels(),
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      if (this.npsChartData.npsGraph[d] >= 0) {
        this.barColor[0].backgroundColor.push('#0C8054');
      } else {
        this.barColor[0].backgroundColor.push('#FF0000');
      }
      this.chart.data[0].data.push(this.npsChartData.npsGraph[d]);
    });
  }

  getFormatForlabels() {
    if (this.selectedInterval === 'date') return 'DD MMM';
    else if (this.selectedInterval === 'month') return 'MMM YYYY';
    return '';
  }

  /**
   * @function getNPSChartData To get NPS chart data
   */
  protected getNPSChartData(): void {
    const configuration = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    configuration.queryObj = this.getModifiedConfig(configuration);
    this.$subscription.add(
      this._statisticService.getOverallNPSStatistics(configuration).subscribe(
        (response) => {
          this.npsChartData = new NPS().deserialize(response);
          this.initGraphData();
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

  /**
   * @function exportCSV To export CSV report for NPS.
   */
  exportCSV(): void {
    const configuration = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          feedbackType: this.getFeedbackType(),
        },
      ]),
    };
    configuration.queryObj = this.getModifiedConfig(configuration);
    this.$subscription.add(
      this._statisticService.exportOverallNPSCSV(configuration).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_export_' + new Date().getTime() + '.csv'
          );
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  getModifiedConfig(configuration) {
    const fromDate = this.tableService.getNPSStartDate(
      this.globalQueries[6].fromDate,
      this.globalQueries[5].toDate,
      this._globalFilterService.timezone
    );
    return (
      configuration.queryObj.substring(
        0,
        configuration.queryObj.indexOf('fromDate=')
      ) +
      `fromDate=${fromDate}` +
      configuration.queryObj.substring(
        configuration.queryObj.indexOf(
          '&',
          configuration.queryObj.indexOf('fromDate=')
        ),
        configuration.queryObj.length
      )
    );
  }
}
