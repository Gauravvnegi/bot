import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { FeedbackDistribution } from '../../data-models/statistics.model';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit {
  globalQueries;
  $subscription = new Subscription();
  totalDistribution = 0;
  color = {
    veryPoor: '#CC052B',
    poor: '#EF1D45',
    adequate: '#FF8F00',
    good: '#4BA0F5',
    veryGood: '#224BD5',
    outstanding: '#508919',
  };

  defaultChart: any = {
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
      responsive: true,
      cutoutPercentage: 80,
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
      responsive: true,
      cutoutPercentage: 80,
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
  };

  keyLabels = [];
  loading: boolean = false;

  distribution: FeedbackDistribution;
  constructor(
    protected statisticsService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _adminUtilityService: AdminUtilityService,
    protected _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getFeedbackDistribution();
      })
    );
  }

  initChartData(): void {
    this.totalDistribution = 0;
    this.keyLabels.length = this.chart.Data[0].length = this.chart.Labels.length = this.chart.Colors[0].backgroundColor.length = this.chart.Colors[0].borderColor.length = 0;
    Object.keys(this.distribution).forEach((key) => {
      if (key !== 'totalCount') {
        if (this.distribution[key].count) {
          this.chart.Labels.push(this.distribution[key].label);
          this.chart.Data[0].push(this.distribution[key].count);
          this.chart.Colors[0].backgroundColor.push(this.color[key]);
          this.chart.Colors[0].borderColor.push(this.color[key]);
        }
        this.totalDistribution += this.distribution[key].count;
        this.keyLabels.push({
          ...this.distribution[key],
          color: this.color[key],
        });
      }
    });
  }

  getFeedbackDistribution() {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService.feedbackDistribution(config).subscribe(
      (response) => {
        this.loading = false;
        this.distribution = new FeedbackDistribution().deserialize(response);
        this.initChartData();
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }
}
