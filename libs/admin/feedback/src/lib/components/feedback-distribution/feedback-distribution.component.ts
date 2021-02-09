import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { FeedbackDistribution } from '../../data-models/statistics.model';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'hospitality-bot-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.scss'],
})
export class FeedbackDistributionComponent implements OnInit {
  globalQueries;
  $subscription = new Subscription();

  color = {
    veryPoor: '#CC052B',
    poor: '#EF1D45',
    adequate: '#FF8F00',
    good: '#4BA0F5',
    veryGood: '#224BD5',
    outstanding: '#508919',
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
    },
  };

  keyLabels = [];

  distribution: FeedbackDistribution;
  constructor(
    private statisticsService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    this.getFeedbackDistribution();
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
      })
    );
  }

  initChartData(): void {
    this.chart.Data[0].length = this.chart.Labels.length = this.chart.Colors[0].backgroundColor.length = this.chart.Colors[0].borderColor.length = 0;
    Object.keys(this.distribution).forEach((key) => {
      if (key !== 'totalCount') {
        if (this.distribution[key].count) {
          this.chart.Labels.push(this.distribution[key].label);
          this.chart.Data[0].push(this.distribution[key].count);
          this.chart.Colors[0].backgroundColor.push(this.color[key]);
          this.chart.Colors[0].borderColor.push(this.color[key]);
        }
        this.keyLabels.push({
          ...this.distribution[key],
          color: this.color[key],
        });
      }
    });
  }

  getFeedbackDistribution() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.statisticsService
      .feedbackDistribution(config)
      .subscribe((response) => {
        this.distribution = new FeedbackDistribution().deserialize(response);
        this.initChartData();
      });
  }
}
