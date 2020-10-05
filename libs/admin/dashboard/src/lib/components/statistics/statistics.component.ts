import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics } from '../../data-models/statistics.model';
import { GlobalFilterService } from '../../../../../../../apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { DateRangeFilterService } from '../../../../../../../apps/admin/src/app/core/theme/src/lib/services/daterange-filter.service';
import { forkJoin, of } from 'rxjs';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';

@Component({
  selector: 'hospitality-bot-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  statistics: Statistics;
  constructor(
    private _statisticService: StatisticsService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();

    // this.getStatistics();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
      // let hotelInfo = { hotelId: 'ca60640a-9620-4f60-9195-70cc18304edd' };
      const queries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      const config = {
        queryObj: this._adminUtilityService.makeQueryParams(queries),
      };

      this._statisticService.getStatistics(config).subscribe(({ stats }) => {
        this.statistics = new Statistics().deserialize(stats);
      });
    });
  }

  getStatistics() {
    //to-do

    let hotelInfo = { hotelId: 'ca60640a-9620-4f60-9195-70cc18304edd' };
    const queries = [hotelInfo];
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    this._statisticService.getStatistics(config).subscribe(({ stats }) => {
      this.statistics = new Statistics().deserialize(stats);
    });
  }
}
