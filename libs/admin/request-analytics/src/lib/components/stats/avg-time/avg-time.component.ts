import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics.service';
import {
  AdminUtilityService,
  QueryConfig,
  getCalendarType,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'avg-time',
  templateUrl: './avg-time.component.html',
  styleUrls: ['./avg-time.component.scss'],
})
export class AvgTimeComponent implements OnInit {
  $subscription = new Subscription();
  globalQueries;
  selectedInterval;
  selectedTabIndex: number = 0;
  constructor(
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService
  ) {}

  readonly options = options;

  tabFilterItems = [
    {
      label: 'Agent',
      value: 'serviceItemUser',
    },
    {
      label: 'Category',
      value: 'category',
    },
  ];

  dataLoaded = false;
  data;

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  labels: string[];

  initGraphData(): void {
    this.$subscription.add(
      this.analyticsService
        .getAvgResolveTimeStats(this.getQueryConfig())
        .subscribe((res) => {
          this.data = [];
          const datasets = [
            {
              data: [],
              label: 'Line',
              fill: false,
            },
          ];

          this.labels = Object.keys(res.categoryStats);
          datasets[0].data = Object.values(res.categoryStats) as any;
          this.data = datasets;
        })
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          entityType: 'FOCUSED',
          type: this.tabFilterItems[this.selectedTabIndex].value,
        },
      ]),
    };
    return config;
  }

  onSelectedTabFilterChange(data) {
    this.selectedTabIndex = data.index;
    this.initGraphData();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      const calenderType = {
        calenderType: getCalendarType(
          data['dateRange'].queryValue[0].toDate,
          data['dateRange'].queryValue[1].fromDate,
          this.globalFilterService.timezone
        ),
      };
      this.selectedInterval = calenderType.calenderType;
      //set-global query every time global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
        calenderType,
      ];

      this.initGraphData();
    });
  }
}

const options = {
  elements: {
    line: {
      tension: 0,
    },
    point: {
      radius: 0,
      borderWidth: 2,
      hitRadius: 5,
      hoverRadius: 0,
      hoverBorderWidth: 2,
    },
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
    filter: function (tooltipItem, data) {
      return !data.datasets[tooltipItem.datasetIndex].tooltipHidden; // custom added prop to dataset
    },
    callbacks: {
      label: function (context) {
        if (context.value !== null) {
          return ' ART: ' + context.value + ' hrs';
        }
      },
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          callback: function (value, index, ticks) {
            return value + ' hrs';
          },
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          min: 'Monday',
          max: 'Sunday',
        },
        gridLines: {
          display: false,
        },
      },
    ],
  },
};
