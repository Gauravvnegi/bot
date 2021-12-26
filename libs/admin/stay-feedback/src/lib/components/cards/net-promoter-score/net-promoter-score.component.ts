import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { globalFeedback } from '@hospitality-bot/admin/feedback';
import {
  AdminUtilityService,
  BarChart,
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
  globalFeedbackConfig = globalFeedback;
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
    Data: [
      {
        data: [''],
        label: 'Overall NPS',
      },
    ],
    Labels: [''],
    Options: chartConfig.options.nps,
    Colors: chartConfig.colors.nps,
    Legend: false,
    Type: chartConfig.type.line,
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
        this.getNPSChartData();
      })
    );
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
    this.chart.Type = option.value;
    this.chart.Colors[0].backgroundColor = option.backgroundColor;
  }

  /**
   * @function initGraphData To initialize the graph data.
   */
  protected initGraphData(): void {
    const botKeys = Object.keys(this.npsChartData.npsGraph);
    this.chart.Data[0].data = [];
    this.chart.Labels = [];
    botKeys.forEach((d, i) => {
      this.chart.Labels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
          this._globalFilterService.timezone,
          this.selectedInterval === 'date'
            ? 'DD MMM'
            : this.selectedInterval === 'month'
            ? 'MMM YYYY'
            : '',
          this.selectedInterval === 'week'
            ? this._adminUtilityService.getToDate(this.globalQueries)
            : null
        )
      );
      this.chart.Data[0].data.push(this.npsChartData.npsGraph[d]);
    });
  }

  /**
   * @function getNPSChartData To get NPS chart data
   */
  protected getNPSChartData(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getOverallNPSStatistics(config).subscribe(
        (response) => {
          this.npsChartData = new NPS().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
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
          order: 'DESC',
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
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
