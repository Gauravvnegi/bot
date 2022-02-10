import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Statistics, Customer } from '../../data-models';

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
  customerData: Customer;
  interval: string = 'day';
  $subscription = new Subscription();
  hotelId: string;
  channelOptions = [{ label: 'All', value: 'ALL' }];

  constructor(
    private _statisticService: StatisticsService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService
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
      this._globalFilterService.globalFilter$.subscribe((data) => {
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getDashboardStats(queries);
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.channelOptions = [{ label: 'All', value: 'ALL' }];
        this.getHotelChannels();
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

  /**
   * @function getHotelId To set the hotel id after extractinf from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * @function getHotelChannels To get all the communication channels for the current hotel.
   */
  getHotelChannels(): void {
    this.$subscription.add(
      this._statisticService.getHotelChannels(this.hotelId).subscribe(
        (response) => {
          response?.forEach((channel) =>
            this.channelOptions.push({
              label: channel.name,
              value: channel.name,
            })
          );
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.error.some_thing_wrong',
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
