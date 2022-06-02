import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription, Observable } from 'rxjs';
import { MarketingService } from '../../../../services/stats.service';
import { ContactStat } from '../../../../data-models/stats.model';

@Component({
  selector: 'hospitality-bot-contact-stats',
  templateUrl: './contact-stats.component.html',
  styleUrls: ['./contact-stats.component.scss'],
})
export class ContactStatsComponent implements OnInit {
  contactValue = [{
      graphvalue: 75,
      label: 'TESTING',
      radius: 75,
      color: '#52B33F',
      progress:65,
},
{
  graphvalue: 75,
  label: 'TESTING2',
  radius: 85,
  color: '#FF8F00',
  progress:35,
},
{
  graphvalue: 75,
  label: 'TESTING3',
  radius: 95,
  color: '#CC052B',
  progress:85,
}];

globalQueries = [];
hotelId: any;
stats: ContactStat;
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
        this.stats = new ContactStat().deserialize(data['Contact Stats']);
        console.log(this.stats)
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
    toDate:1651041888000,
    fromDate:1651041868000
  }
): Observable<any> {
  queries.push(defaultProps);
  const config = {
    queryObj: this.adminUtilityService.makeQueryParams(queries),
  };
  return this.marketingService.getContactStats(this.hotelId, config);
}

}
