import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
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
  hotelId: any;
  stats: MarketingStats;
  $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private marketingService: MarketingService,
    protected _snackbarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      this.loadInitialData([
        {
        },
      ])
    });
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

  loadInitialData(queries = []): void {
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.stats = new MarketingStats().deserialize(data);
        },
        ({ error }) => {
          this._snackbarService
            .openSnackBarWithTranslate({
              translateKey: 'no data',
              priorityMessage: error.message,
            })
            .subscribe();
        }
      )
    );
  }
  fetchDataFrom(
    queries,
    defaultProps = {
      toDate: 1653893078000,
      fromDate: 1651387478000
    }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.marketingService.getMarketingCards(this.hotelId, config);
  }

}
