import { Component, Input, OnInit } from '@angular/core';
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
import { ChartTypeOption } from '../../../types/feedback.type';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './net-promoter-score.component.scss',
  ],
})
export class NetPromoterScoreComponent implements OnInit {
  @Input() globalFeedbackFilterType: string;
  @Input() hotelId;
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

  constructor(
    protected fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService
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
        ];
<<<<<<< HEAD
        this.setEntityId();
=======
        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        )
          this.globalQueries = [
            ...this.globalQueries,
            { entityIds: this._statisticService.outletIds },
          ];
>>>>>>> k8s-dev-deploy
        this.getNPSChartData();
      })
    );
  }

<<<<<<< HEAD
  setEntityId() {
    if (this.globalFeedbackFilterType === feedback.types.transactional)
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
      ];
    else if (this.globalFeedbackFilterType === feedback.types.both) {
      this.globalQueries = [
        ...this.globalQueries,
        { entityIds: this._statisticService.outletIds },
      ];
      this.globalQueries.forEach((element) => {
        if (element.hasOwnProperty('entityIds')) {
          element.entityIds.push(this.hotelId);
        }
      });
    } else {
      this.globalQueries = [...this.globalQueries, { entityIds: this.hotelId }];
    }
  }

=======
>>>>>>> k8s-dev-deploy
  listenForOutletChanged() {
    this._statisticService.outletChange.subscribe((response) => {
      if (response) {
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
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { feedbackType: this.globalFeedbackFilterType },
      ]),
    };
    this.$subscription.add(
      this._statisticService.getOverallNPSStatistics(config).subscribe(
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
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          feedbackType: this.globalFeedbackFilterType,
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallNPSCSV(config).subscribe(
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
