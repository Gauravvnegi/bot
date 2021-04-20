import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { Status } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';
import { GuestDatatableModalComponent } from '../guest-datatable-modal/guest-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-guest-status-statistics',
  templateUrl: './guest-status-statistics.component.html',
  styleUrls: ['./guest-status-statistics.component.scss'],
})
export class GuestStatusStatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  guestStatusData: Status = new Status();

  selectedInterval: any;

  $subscription = new Subscription();

  legendData = [
    {
      label: 'New',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
    },
    {
      label: 'Pre Check-In',
      borderColor: '#F2509B',
      backgroundColor: '#F2509B',
      dashed: false,
    },
    {
      label: 'Check-In',
      borderColor: '#0239cf',
      backgroundColor: '#0239cf',
      dashed: false,
    },
    {
      label: 'Checkout',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: true,
    },
  ];

  public getLegendCallback: any = ((self: this): any => {
    function handle(chart: any): any {
      return chart.legend.legendItems;
    }

    return function (chart: Chart): any {
      return handle(chart);
    };
  })(this);

  chartTypes = [
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
  ];

  chart: any = {
    chartData: [
      { data: [], label: 'New', fill: false, borderDash: [5, 5] },
      { data: [], label: 'Pre Check-In', fill: false },
      { data: [], label: 'Check-In', fill: false },
      { data: [], label: 'Checkout', fill: false, borderDash: [5, 5] },
    ],
    chartLabels: [],
    chartOptions: {
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
      responsive: true,
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
      legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#0239CF',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#F2509B',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#0239CF',
        backgroundColor: '#FFFFFF',
      },
      {
        borderColor: '#F2509B',
        backgroundColor: '#FFFFFF',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };

  chips = [
    { label: 'All', icon: '', value: 'ALL', isSelected: true },
    {
      label: 'New',
      icon: '',
      value: 'NEW',
      total: 0,
      isSelected: false,
      type: 'pending',
    },
    {
      label: 'Precheckin ',
      icon: '',
      value: 'PRECHECKIN',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Checkin ',
      icon: '',
      value: 'CHECKIN',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
    {
      label: 'Checkout ',
      icon: '',
      value: 'CHECKOUT',
      total: 0,
      isSelected: false,
      type: 'completed',
    },
  ];

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage:0
    },
    {
      label: 'VIP',
      content: '',
      value: 'VIP',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage:0
    },
    {
      label: 'General',
      content: '',
      value: 'GENERAL',
      disabled: false,
      total: 0,
      chips: this.chips,
      lastPage:0
    },
  ];

  globalQueries;

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _modal: ModalService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getGuestStatus();
      })
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

  private initGraphData(): void {
    const botKeys = Object.keys(this.guestStatusData.checkinGuestStats);
    this.chart.chartData.forEach((d) => {
      d.data = [];
    });
    this.chart.chartLabels = [];
    botKeys.forEach((d, i) => {
      this.chart.chartLabels.push(
        this.dateService.convertTimestampToLabels(
          this.selectedInterval,
          d,
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
      this.chart.chartData[0].data.push(this.guestStatusData.newGuestStats[d]);
      this.chart.chartData[1].data.push(
        this.guestStatusData.checkinGuestStats[d]
      );
      this.chart.chartData[2].data.push(
        this.guestStatusData.precheckinGuestStats[d]
      );
      this.chart.chartData[3].data.push(
        this.guestStatusData.checkoutGuestStats[d]
      );
    });
  }

  setChartType(option, event): void {
    event.stopPropagation();
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
      this.setChartColors();
    }
  }

  private getGuestStatus(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getGuestStatus(config).subscribe(
        (response) => {
          this.guestStatusData = new Status().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  setChartColors(): void {
    if (this.chart.chartType === 'bar') {
      this.chart.chartColors = [
        {
          backgroundColor: '#0239CF',
        },
        {
          backgroundColor: '#F2509B',
        },
        {
          backgroundColor: '#288ad6',
        },
        {
          backgroundColor: '#F2809B',
        },
      ];
    } else {
      this.chart.chartColors = [
        {
          borderColor: '#0239CF',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#F2509B',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#0239CF',
          backgroundColor: '#FFFFFF',
        },
        {
          borderColor: '#F2509B',
          backgroundColor: '#FFFFFF',
        },
      ];
    }
  }

  openTableModal() {
    // event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const tableCompRef = this._modal.openDialog(
      GuestDatatableModalComponent,
      dialogConfig
    );

    tableCompRef.componentInstance.tableName = 'Guest Status';
    tableCompRef.componentInstance.tabFilterItems = this.tabFilterItems;
    tableCompRef.componentInstance.callingMethod = 'getAllGuestStats';
    tableCompRef.componentInstance.guestFilter = 'GUESTSTATUS';
    tableCompRef.componentInstance.exportURL = 'exportCSVStat';
    
    this.$subscription.add(
      tableCompRef.componentInstance.onModalClose.subscribe((res) => {
        tableCompRef.close();
      })
    );
  }
}
