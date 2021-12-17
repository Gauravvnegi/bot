import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { SharedStats } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss'],
})
export class SharedComponent implements OnInit {
  $subscription = new Subscription();
  selectedInterval;
  globalQueries;
  stats: SharedStats;
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
      cutoutPercentage: 0,
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
  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected dateService: DateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe(
        (data) => {
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
          this.getStats();
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  getStats() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getSharedStats(config).subscribe((response) => {
        this.stats = new SharedStats().deserialize(response);
        this.initGraph(
          this.stats.feedbacks.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          ) === 0
        );
      })
    );
  }

  initGraph(defaultGraph = true) {
    if (defaultGraph) {
      this.chart.Labels = ['No Data'];
      this.chart.Data = [[100]];
      this.chart.Colors[0] = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      return;
    }
    this.chart.Labels = [];
    this.chart.Data = [[]];
    this.chart.Colors[0].backgroundColor = [];
    this.chart.Colors[0].borderColor = [];

    this.stats.feedbacks.forEach((data) => {
      if (data.count) {
        this.chart.Labels.push(data.label);
        this.chart.Data[0].push(data.count);
        this.chart.Colors[0].backgroundColor.push(data.color);
        this.chart.Colors[0].borderColor.push(data.color);
      }
    });
  }
}
