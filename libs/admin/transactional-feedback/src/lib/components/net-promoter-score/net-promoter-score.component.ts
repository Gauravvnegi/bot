import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { NPS } from '../../data-models/statistics.model';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as FileSaver from 'file-saver';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'hospitality-bot-net-promoter-score',
  templateUrl: './net-promoter-score.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './net-promoter-score.component.scss',
  ],
})
export class NetPromoterScoreComponent implements OnInit {
  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];
  $subscription = new Subscription();
  selectedInterval: string;
  npsChartData: NPS;
  globalQueries = [];

  chartTypes = [
    {
      name: 'Bar',
      value: 'bar',
      url: 'assets/svg/bar-graph.svg',
      backgroundColor: '#1AB99F',
    },
    {
      name: 'Line',
      value: 'line',
      url: 'assets/svg/line-graph.svg',
      backgroundColor: '#DEFFF3',
    },
  ];

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  chart: any = {
    chartData: [
      {
        data: [],
        label: 'Overall NPS',
      },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 4,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 5,
          hoverBorderWidth: 2,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: -100,
              max: 100,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
    chartColors: [
      {
        borderColor: '#0C8054',
        backgroundColor: '#DEFFF3',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0C8054',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: '#0C8054',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };

  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.initFG();
    // this.setChartLabels();
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
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
    });
  }

  setChartType(option): void {
    this.chart.chartType = option.value;
    this.chart.chartColors[0].backgroundColor = option.backgroundColor;
  }

  private initGraphData(): void {
    const botKeys = Object.keys(this.npsChartData.npsGraph);
    this.chart.chartData[0].data = [];
    this.chart.chartLabels = [];
    botKeys.forEach((d, i) => {
      this.chart.chartLabels.push(
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
      this.chart.chartData[0].data.push(this.npsChartData.npsGraph[d]);
    });
  }

  private getNPSChartData(): void {
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

  exportCSV() {
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
