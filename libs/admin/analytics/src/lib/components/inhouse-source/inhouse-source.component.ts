import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { InhouseSource } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'hospitality-bot-inhouse-source',
  templateUrl: './inhouse-source.component.html',
  styleUrls: ['./inhouse-source.component.scss'],
})
export class InhouseSourceComponent implements OnInit {
  @Input() entityType = 'Inhouse';
  $subscription = new Subscription();
  globalFilters;
  graphData;
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
          { entityType: this.entityType },
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
      this.analyticsService.getSourceStats(config).subscribe(
        (response) => {
          this.graphData = new InhouseSource().deserialize(response);
          this.initGraphData();
        },
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Labels = [];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];
    const keys = Object.keys(this.graphData.inhouseRequestSourceStats);
    keys.forEach((key, index) => {
      if (this.graphData.inhouseRequestSourceStats[key].value) {
        this.chart.Data[0].push(
          this.graphData.inhouseRequestSourceStats[key].value
        );
        this.chart.Labels.push(key);
        this.chart.Colors[0].backgroundColor.push(
          this.graphData.inhouseRequestSourceStats[key].color
        );
        this.chart.Colors[0].borderColor.push(
          this.graphData.inhouseRequestSourceStats[key].color
        );
      }
    });
    if (!this.chart.Data[0].reduce((a, b) => a + b, 0)) {
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
    if (this.graphData.inhouseRequestSourceStats)
      return Object.keys(this.graphData.inhouseRequestSourceStats);
    return [];
  }
}
