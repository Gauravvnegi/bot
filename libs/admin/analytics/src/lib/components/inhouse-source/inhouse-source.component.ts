import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-inhouse-source',
  templateUrl: './inhouse-source.component.html',
  styleUrls: ['./inhouse-source.component.scss'],
})
export class InhouseSourceComponent implements OnInit {
  $subscription = new Subscription();
  globalFilters;
  source = {
    totalCount: 0,
    stats: {
      WhatsApp: { value: 0, color: '#2a8853' },
      'Web Bot': { value: 0, color: '#f76b8a' },
      Messenger: { value: 0, color: '#224bd5' },
    },
  };
  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
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
      cutoutPercentage: 75,
    },
  };
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private analyticsService: AnalyticsService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalFilters = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getInhouseSourceData();
      })
    );
  }

  getInhouseSourceData() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalFilters),
    };

    this.$subscription.add(
      this.analyticsService.getInhouseSourceStats(config).subscribe(
        (response) => {
          console.log(response);
          this.initGraphData();
        },
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    // this.chart.Data[0][0] = this.source.INITIATED;
    // this.chart.Data[0][1] = this.source.PENDING;
    // this.chart.Data[0][2] = this.source.ACCEPTED;
    // this.chart.Data[0][3] = this.source.REJECTED;

    if (this.chart.Data[0].reduce((a, b) => a + b, 0)) {
      this.setChartOptions();
    } else {
      this.chart.Data = [[100]];
      this.chart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      this.chart.Labels = ['No data'];
    }
  }

  setChartOptions() {
    this.chart.Labels = ['Initiated', 'Pending', 'Accepted', 'Rejected'];

    this.chart.Colors = [
      {
        backgroundColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
        borderColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
      },
    ];
  }

  get stats() {
    return Object.keys(this.source.stats);
  }
}
