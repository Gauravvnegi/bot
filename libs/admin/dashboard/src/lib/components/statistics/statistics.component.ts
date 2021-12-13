import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics, Customer } from '../../data-models/statistics.model';
import { GlobalFilterService } from '../../../../../../../apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';

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

    // this.getStatistics();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        const queries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.channelOptions = [{ label: 'All', value: 'ALL' }];
        this.getHotelChannels();
        const config = {
          queryObj: this._adminUtilityService.makeQueryParams(queries),
        };

        this._statisticService.getStatistics(config).subscribe(({ stats }) => {
          this.statistics = new Statistics().deserialize(stats);
        });
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getHotelChannels() {
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
        ({ error }) => this.snackbarService.openSnackBarAsText(error?.message)
      )
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
