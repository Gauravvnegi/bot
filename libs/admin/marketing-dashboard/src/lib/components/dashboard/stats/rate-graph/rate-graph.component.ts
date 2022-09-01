import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { RateGraphStats } from '../../../../data-models/graph.model';
import { MarketingService } from '../../../../services/stats.service';

@Component({
  selector: 'hospitality-bot-rate-graph',
  templateUrl: './rate-graph.component.html',
  styleUrls: ['./rate-graph.component.scss'],
})
export class RateGraphComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  legendData: any = [
    {
      label: 'Open Rate',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
      src: 'delivered',
    },
    {
      label: 'Click Rate',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
      src: 'sent',
    },
  ];

  chart: any = {
    chartData: [
      { data: [], label: 'clickRate', fill: true },
      { data: [], label: 'openRate', fill: true },
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
              min: 0,
              stepSize: 20,
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
        borderColor: '#FFBF04',
        backgroundColor: '#FFC10780',
        pointBackgroundColor: '#FFBF04',
        pointBorderColor: '#ffffff',
      },
      {
        borderColor: '#52B33F',
        backgroundColor: '#31BB9280',
        pointBackgroundColor: '#52B33F',
        pointBorderColor: '#ffffff',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  };
  globalQueries = [];
  selectedInterval: string;
  @Input() hotelId: string;
  $subscription = new Subscription();
  rateGraph: RateGraphStats;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private statsService: MarketingService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters.
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
        this.hotelId = this.globalFilterService.hotelId;
        this.rateGraphStats();
      })
    );
  }

  /**
   * @function rateGraphStats To get rate graph data.
   */
  rateGraphStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.statsService.rateGraphStats(this.hotelId, config).subscribe(
        (response) => {
          this.rateGraph = new RateGraphStats().deserialize(response);
          this.initChartData();
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  /**
   * @function initChartData To initialize chart data.
   */
  initChartData() {
    this.chart.chartLabels = this.rateGraph.label;
    this.chart.chartData[0].data = this.rateGraph.clickRate;
    this.chart.chartData[1].data = this.rateGraph.openRate;
  }

  /**
   * @function legendOnClick To perform action on legend selection change.
   * @param index The selected legend index.
   */
  legendOnClick = (index) => {
    const ci = this.baseChart.chart;
    const alreadyHidden =
      ci.getDatasetMeta(index).hidden === null
        ? false
        : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach((e, i) => {
      const meta = ci.getDatasetMeta(i);

      if (i === index) {
        if (!alreadyHidden) {
          meta.hidden = true;
        } else {
          meta.hidden = false;
        }
      }
    });

    ci.update();
  };

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
