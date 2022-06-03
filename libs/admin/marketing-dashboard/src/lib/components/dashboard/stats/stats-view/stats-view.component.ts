import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Observable, Subscription } from 'rxjs';
import { MarketingStats } from '../../../../data-models/stats.model';
import { MarketingService } from '../../../../services/stats.service';

@Component({
  selector: 'hospitality-bot-stats-view',
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.scss']
})
export class StatsViewComponent implements OnInit {

  globalQueries = [];
  selectedInterval;
  hotelId: any;
  stats: MarketingStats;
  $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private marketingService: MarketingService,
    protected _snackbarService: SnackBarService,    
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

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
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getMarketingCards(): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.marketingService.getMarketingCards(this.hotelId, config).subscribe(
        (response) => {
          this.stats = new MarketingStats().deserialize(response);
          console.log(this.stats);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

}
