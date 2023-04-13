import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { ComparisonGraphStats } from '../../data-models/graph.model';
import { MarketingService } from '../../services/stats.service';
import { dashboardConfig } from '../constants/dashboard';
import { GraphData } from '../types/stats';

@Component({
  selector: 'hospitality-bot-marketing-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class MarketingDashboardComponent implements OnInit, OnDestroy {
  welcomeMessage = 'Welcome To eMark-IT';
  navRoutes = [{ label: 'eMark-IT Stats', link: './' }];
  $subscription = new Subscription();
  hotelId: string;
  config: any;
  loading = false;
  rateGraph: GraphData = {
    title: 'rateGraph.title',
    chart: {},
    legendData: dashboardConfig.rateGraph.legendData,
  };

  subscriberGraph: GraphData = {
    title: 'subscriber.title',
    chart: {},
    legendData: dashboardConfig.subscriber.legendData,
  };

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService,
    private statsService: MarketingService,
    private snackbarService: SnackBarService
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

        const globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];

        this.config = {
          queryObj: this._adminUtilityService.makeQueryParams(globalQueries),
        };

        this.hotelId = this.globalFilterService.hotelId;
        this.loading = true;
        this.rateGraphStats();
        this.subscriberGraphStats();
      })
    );
  }

  /**
   * @function rateGraphStats To get rate graph data.
   */
  rateGraphStats(): void {
    this.$subscription.add(
      this.statsService
        .rateGraphStats(this.hotelId, this.config)
        .subscribe((response) => {
          this.loading = false;
          const graph = new ComparisonGraphStats().deserialize(response);
          this.rateGraph.chart = {
            chartLabels: graph.labels,
            chartData: [
              { data: graph.primaryData, label: 'Click Rate', fill: false },
              { data: graph.secondaryData, label: 'Open Rate', fill: false },
            ],
          };
        }, this.handleError)
    );
  }

  /**
   * @function subscriberGraphStats To get subscriber graph data.
   */
  subscriberGraphStats(): void {
    this.$subscription.add(
      this.statsService
        .subscriberGraphStats(this.hotelId, this.config)
        .subscribe((response) => {
          this.loading = false;
          const graph = new ComparisonGraphStats().deserialize(response);
          this.subscriberGraph.chart = {
            chartLabels: graph.labels,
            chartData: [
              {
                data: graph.primaryData,
                label: 'Unsubscribers',
                fill: false,
              },
              {
                data: graph.secondaryData,
                label: 'Subscribers',
                fill: false,
              },
            ],
          };
        }, this.handleError)
    );
  }

  handleError = ({ error }) => {
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
    this.loading = false;
  };

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
