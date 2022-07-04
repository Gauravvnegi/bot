import {
  Component,
  OnDestroy,
  OnInit,
  ɵtransitiveScopesFor,
} from '@angular/core';
import { sharedConfig } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { MarketingStats } from '../../../../data-models/stats.model';
import { MarketingService } from '../../../../services/stats.service';

@Component({
  selector: 'hospitality-bot-stats-view',
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.scss'],
})
export class StatsViewComponent implements OnInit, OnDestroy {
  adminSharedConfig = sharedConfig;
  globalQueries = [];
  selectedInterval: string;
  hotelId: string;
  stats: MarketingStats;
  $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private marketingService: MarketingService,
    protected _snackbarService: SnackBarService,
    private dateService: DateService
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
        let calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getMarketingCards();
      })
    );
  }

  /**
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries: any[]): void {
    globalQueries.forEach(
      (element: { hasOwnProperty: (arg0: string) => any; hotelId: any }) => {
        if (element.hasOwnProperty('hotelId')) {
          this.hotelId = element.hotelId;
        }
      }
    );
  }

  /**
   * @function getMarketingCards To get data for stat cards.
   */
  getMarketingCards(): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.marketingService.getMarketingCards(this.hotelId, config).subscribe(
        (response) => {
          this.stats = new MarketingStats().deserialize(response);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
