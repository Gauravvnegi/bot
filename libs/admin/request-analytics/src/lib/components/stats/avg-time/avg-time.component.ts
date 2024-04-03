import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../../services/analytics.service';
import {
  AdminUtilityService,
  DualPlotDataset,
  QueryConfig,
  getCalendarType,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormBuilder, FormGroup } from '@angular/forms';
import { complaintEntityFilterOption } from '../../../constant/stats';

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

  readonly options = options;
  dataLoaded = false;
  data;

  labels: string[];
  readonly complaintEntityFilterOption = complaintEntityFilterOption;
  useForm: FormGroup;

  constructor(
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initForm() {
    this.useForm = this.fb.group({
      statsFilter: ['ALL'],
    });

    this.useForm.get('statsFilter').valueChanges.subscribe((res) => {
      this.initGraphData();
    });
  }

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
              type: 'line',
              fill: false,
              borderColor: ['#000000'],
              backgroundColor: ['#000000'],
              tooltipHidden: false,
            },
            {
              data: [],
              label: 'Line',
              type: 'bar',
              fill: false,
              backgroundColor: '#4BC0C0',
            },
          ];

          this.labels = Object.keys(res.categoryStats);
          const data = Object.values(res.categoryStats) as any;
          datasets[1].data = data;
          const sum = data.reduce((acc, val) => acc + val);
          datasets[0].data = new Array(data.length).fill(sum / data.length);

          this.data = datasets;
        })
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          entityType: this.useForm.get('statsFilter').value,
          type: 'serviceItemUser',
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
          return context.value + ' hrs';
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
          beginAtZero: true,
        },
        gridLines: {
          display: false,
        },
      },
    ],
  },
};
