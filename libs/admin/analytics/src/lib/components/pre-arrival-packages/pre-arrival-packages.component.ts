import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { InhouseSentiments } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';
import { InhouseRequestDatatableComponent } from '../inhouse-request-datatable/inhouse-request-datatable.component';

@Component({
  selector: 'hospitality-bot-pre-arrival-packages',
  templateUrl: './pre-arrival-packages.component.html',
  styleUrls: ['./pre-arrival-packages.component.scss'],
})
export class PreArrivalPackagesComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;
  $subscription = new Subscription();
  globalFilters;
  selectedInterval: any;
  graphData;
  packageFG: FormGroup;
  @Input() entityType = 'pre-arrival';

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  legendData = [
    {
      label: 'To Do',
      bubbleColor: '#fb3d4e',
      img: 'assets/svg/test-4.svg',
    },
    {
      label: 'Active',
      bubbleColor: '#4A73FB',
      img: 'assets/svg/test.svg',
    },
    {
      label: 'Closed',
      bubbleColor: '#F25E5E',
      img: 'assets/svg/test-2.svg',
    },
    {
      label: 'Timeout',
      bubbleColor: '#30D8B6',
      img: 'assets/svg/test-3.svg',
    },
  ];

  chartTypes = [
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
  ];

  chart: any = {
    chartData: [{ data: [], label: 'To Do', fill: false }],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
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
              min: 0,
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
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#fb3d4e',
        backgroundColor: '#fb3d4e',
      },
      {
        borderColor: '#FF9F67',
        backgroundColor: '#FF9F67',
      },
      {
        borderColor: '#2a8853',
        backgroundColor: '#2a8853',
      },
      {
        borderColor: '#0bb2d4',
        backgroundColor: '#0bb2d4',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };

  tabFilterItems = [];

  tabFilterIdx = 0;
  hotelId: string;

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService,
    private dateService: DateService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG() {
    this.packageFG = this.fb.group({
      chartType: ['line'],
    });
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
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        if (!this.tabFilterItems.length) this.getPackageList();
        this.getInhouseSentimentsData();
      })
    );
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getPackageList() {
    this.$subscription.add(
      this.analyticsService.getPackageList(this.hotelId).subscribe(
        (response) => {
          const packages = response.paidPackages || [];

          packages.forEach((item) => {
            if (item.active && item.packageCode)
              this.tabFilterItems.push({
                label: item.name,
                content: '',
                value: item.id,
                disabled: false,
                total: 0,
              });
          });
        },
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getInhouseSentimentsData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalFilters,
        {
          entityType: this.entityType,
          packageId: this.tabFilterItems[this.tabFilterIdx]?.value,
        },
      ]),
    };

    this.$subscription.add(
      this.analyticsService.getSentimentsStats(config).subscribe(
        (response) => {
          this.graphData = new InhouseSentiments().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  legendOnClick = (index, event) => {
    event.stopPropagation();
    let ci = this.baseChart.chart;
    let alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      let meta = ci.getDatasetMeta(i);

      if (i == index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });
    ci.update();
  };

  setChartType(option, event): void {
    event.stopPropagation();
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
    }
  }

  private initGraphData(): void {
    const keys = Object.keys(this.graphData);
    this.chart.chartData = [];
    this.chart.chartLabels = [];
    // this.chart.chartColors = [];
    keys.forEach((key) => {
      if (key !== 'label' && key !== 'totalCount') {
        if (!this.chart.chartLabels.length)
          this.initChartLabels(this.graphData[key].stats);
        this.chart.chartData.push({
          data: Object.values(this.graphData[key].stats),
          label: this.graphData[key].label,
          fill: false,
        });
      }
    });
  }

  initChartLabels(stat) {
    const keys = Object.keys(stat);
    keys.forEach((d, i) =>
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
            ? this._adminUtilityService.getToDate(this.globalFilters)
            : null
        )
      )
    );
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.getInhouseSentimentsData();
  }

  get stats() {
    if (this.graphData)
      return Object.keys(this.graphData).filter(
        (d) => d !== 'label' && d !== 'totalCount'
      );
    return [];
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      InhouseRequestDatatableComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'Pre-arrival Request';
    detailCompRef.componentInstance.entityType = 'pre-arrival';
    detailCompRef.componentInstance.optionLabels = [
      'Immediate',
      'Reject',
      'Closed',
    ];
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) =>
      // remove loader for detail close
      detailCompRef.close()
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
