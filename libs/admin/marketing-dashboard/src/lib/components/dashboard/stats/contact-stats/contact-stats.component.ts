import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription, Observable } from 'rxjs';
import { MarketingService } from '../../../../services/stats.service';
import { ContactStat } from '../../../../data-models/stats.model';
import { DateService } from '@hospitality-bot/shared/utils';

@Component({
  selector: 'hospitality-bot-contact-stats',
  templateUrl: './contact-stats.component.html',
  styleUrls: ['./contact-stats.component.scss'],
})
export class ContactStatsComponent implements OnInit {
  contactValue = [
    {
      graphvalue: 75,
      label: 'TESTING',
      radius: 75,
      color: '#52B33F',
      progress: 65,
    },
    {
      graphvalue: 75,
      label: 'TESTING2',
      radius: 85,
      color: '#FF8F00',
      progress: 35,
    },
    {
      graphvalue: 75,
      label: 'TESTING3',
      radius: 95,
      color: '#CC052B',
      progress: 85,
    },
  ];

  selectedInterval;
  globalQueries = [];
  hotelId: any;
  stats: ContactStat;
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
        this.getContactStats();
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

  getContactStats(): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this.marketingService.getContactStats(this.hotelId, config).subscribe(
        (response) => {
          this.stats = new ContactStat().deserialize(response['Contact Stats']);
          console.log(this.stats);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }
}
