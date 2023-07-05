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
  entityId: string;
  stats: MarketingStats;
  $subscription = new Subscription();
  loading = false;
  constructor(
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private marketingService: MarketingService,
    protected snackbarService: SnackBarService,
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
        const calenderType = {
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
        this.entityId = this.globalFilterService.entityId;
        this.getMarketingCards();
      })
    );
  }

  /**
   * @function getMarketingCards To get data for stat cards.
   */
  getMarketingCards(): void {
    this.loading = true;
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.marketingService.getMarketingCards(this.entityId, config).subscribe(
        (response) => {
          this.stats = new MarketingStats().deserialize(response);
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false; 
        }
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
