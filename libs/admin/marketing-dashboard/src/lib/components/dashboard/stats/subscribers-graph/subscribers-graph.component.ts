import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { DateService } from '@hospitality-bot/shared/utils';
import { SubscriberGraphStats } from '../../../../data-models/graph.model';
import { MarketingService } from '../../../../services/stats.service';

@Component({
  selector: 'hospitality-bot-subscribers-graph',
  templateUrl: './subscribers-graph.component.html',
  styleUrls: ['./subscribers-graph.component.scss'],
})
export class SubscribersGraphComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  legendData: any = [
    {
      label: 'Subscribers',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
      src: 'delivered',
    },
    {
      label: 'Unsubscribers',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
      src: 'sent',
    },
  ];

  chart: any = {
    chartData: [
      { data: [], label: 'Unsubscribers', fill: false },
      { data: [], label: 'Subscribers', fill: false },
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
  selectedInterval;
  globalQueries;
  @Input() hotelId;
  subscriberGraph: SubscriberGraphStats;
  $subscription = new Subscription();
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _snackbarService: SnackBarService,
    private statsService: MarketingService,
    private _globalFilterService: GlobalFilterService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
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
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.subscriberGraphStats();
      })
    );
  }

  subscriberGraphStats(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.statsService.subscriberGraphStats(this.hotelId, config).subscribe(
        (response) => {
          this.subscriberGraph = new SubscriberGraphStats().deserialize(
            response
          );
          this.initChartData();
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initChartData() {
    this.chart.chartLabels = this.subscriberGraph.labels;
    this.chart.chartData[0].data = this.subscriberGraph.unsubscribers;
    this.chart.chartData[1].data = this.subscriberGraph.subscribers;
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

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
