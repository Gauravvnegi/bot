import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Status } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SnackBarService } from 'libs/shared/material/src';

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
              stepSize: 25,
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
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getGuestStatus();
  }

  legendOnClick = (index) => {
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
    botKeys.forEach((d) => {
      this.chart.chartLabels.push(
        this._adminUtilityService.convertTimestampToLabels(
          this.selectedInterval,
          d
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

  setChartType(option): void {
    if (this.chart.chartType !== option) {
      this.chart.chartType = option.value;
      this.setChartColors();
    }
  }

  private getGuestStatus(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
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
      })
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
}
