import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { Statistics } from '../../data-models';
import { StatisticsService } from '../../services/statistics.service';

/**
 * @class Statistics Component
 */
@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  statistics: Statistics;
  $subscription = new Subscription();

  constructor(
    private _statisticService: StatisticsService,
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getDashboardStats(queries);
      })
    );
  }

  /**
   * @function getDashboardStats To get the dashboard stats fro the api.
   * @param queries The filter list with date and hotel filters.
   */
  getDashboardStats(queries): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    this._statisticService.getStatistics(config).subscribe(({ stats }) => {
      this.statistics = new Statistics().deserialize(stats);
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
