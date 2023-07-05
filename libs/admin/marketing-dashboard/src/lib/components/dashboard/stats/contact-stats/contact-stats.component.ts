import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { MarketingService } from '../../../../services/stats.service';
import { ContactStat } from '../../../../data-models/stats.model';
import { DateService } from '@hospitality-bot/shared/utils';
import { sharedConfig } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-contact-stats',
  templateUrl: './contact-stats.component.html',
  styleUrls: ['./contact-stats.component.scss'],
})
export class ContactStatsComponent implements OnInit, OnDestroy {
  adminSharedConfig = sharedConfig;
  contactValue = [];
  selectedInterval: string;
  globalQueries = [];
  entityId: any;
  contactStats: ContactStat;
  $subscription = new Subscription();

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
        this.getContactStats();
      })
    );
  }

  /**
   * @function getContactStats To get contact stat data.
   */
  getContactStats(): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.marketingService.getContactStats(this.entityId, config).subscribe(
        (response) => {
          this.contactStats = new ContactStat().deserialize(response);
        },
        ({ error }) =>{}
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
