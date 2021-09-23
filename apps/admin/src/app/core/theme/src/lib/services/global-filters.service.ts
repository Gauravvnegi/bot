import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { DateRangeFilterService } from './daterange-filter.service';
import { FilterService } from './filter.service';

@Injectable({ providedIn: 'root' })
export class GlobalFilterService {
  globalFilter$ = new BehaviorSubject({});
  timezone: string;

  globalFilterObj = {
    filter: {
      value: {},
      queryValue: [],
    },
    dateRange: {
      value: {},
      queryValue: [],
    },
    feedback: {
      value: {},
      queryValue: [],
    },
  };

  constructor(
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService
  ) {}

  listenForGlobalFilterChange() {
    this.dateRangeFilterService.emitDateRangeFilterValue$.subscribe((data) => {
      if (Object.keys(data).length) {
        this.globalFilterObj.dateRange.value = {
          end: data['end'],
          label: data['label'],
          start: data['start'],
        };

        this.globalFilterObj.dateRange.queryValue = [
          { toDate: data['end'].unix() * 1000 },
          { fromDate: data['start'].unix() * 1000 },
        ];
        //   = {
        //     toDate: data['end'].unix() * 1000,
        //     fromDate: data['start'].unix() * 1000,
        //   });
        this.globalFilter$.next(this.globalFilterObj);
      }
    });

    this.filterService.emitFilterValue$.subscribe((data) => {
      if (Object.keys(data).length) {
        this.globalFilterObj.filter.value = data;
        this.globalFilterObj.filter.queryValue = [
          { hotelId: get(data, ['property', 'branchName']) },
          {
            guestType: get(data, ['guest', 'guestType', 'isVip'])
              ? 'VIP'
              : null,
          },
          {
            guestType: get(data, ['guest', 'guestType', 'isGeneral'])
              ? 'GENERAL'
              : null,
          },
          {
            guestCategory: get(data, [
              'guest',
              'guestCategory',
              'isRepeatedGuest',
            ])
              ? 'REPEATGUEST'
              : null,
          },
          {
            guestCategory: get(data, ['guest', 'guestCategory', 'isNewGuest'])
              ? 'NEWGUEST'
              : null,
          },
        ];
        this.globalFilterObj.feedback.value = {
          ...data?.feedback,
          ...data?.outlets,
        };
        this.globalFilterObj.feedback.queryValue = [
          {
            type: get(data, ['feedback', 'feedbackType']),
          },
          {
            outlets: get(data, ['outlets']),
          },
        ];
        this.globalFilter$.next(this.globalFilterObj);
      }
    });
  }
}
