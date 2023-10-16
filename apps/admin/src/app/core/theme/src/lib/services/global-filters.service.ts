import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { Subject, BehaviorSubject } from 'rxjs';
import {
  EntitySubType,
  EntityType,
  ModuleNames,
  ProductNames,
} from 'libs/admin/shared/src/index';
import { DateRangeFilterService } from './daterange-filter.service';
import { FilterService } from './filter.service';

@Injectable({ providedIn: 'root' })
export class GlobalFilterService {
  selectedModule = new BehaviorSubject<ModuleNames | ''>('');
  globalFilter$ = new BehaviorSubject<Partial<GlobalFilterData>>({});
  showFullView = new BehaviorSubject<boolean>(false);
  timezone: string;
  entityId: string;
  entityType: EntityType; //category
  entitySubType: EntitySubType; // type
  globalFilterObj: GlobalFilterData = {
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

    this.filterService.emitFilterValue$.subscribe(
      (data: Partial<GlobalFilterData>) => {
        if (Object.keys(data).length) {
          this.globalFilterObj.filter.value = data;
          this.globalFilterObj.filter.queryValue = [
            { entityId: get(data, ['property', 'entityName']) },
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
      }
    );
  }
}

type GlobalFilterData = {
  filter: {
    value: any;
    queryValue: any[];
  };
  dateRange: {
    value: any;
    queryValue: any[];
  };
  feedback: {
    value?: {
      property?: {
        brandName: string; //hotelName (prev)
        entityName: string; //branchName (prev)
      };
      feedback?: {
        feedbackType: string; //'STAYFEEDBACK'; 'TRANSACTIONALFEEDBACK', ALL
      };
      outlets?: any;
    };
    queryValue: any[];
  };
};

export type FilterValue = {
  property: {
    brandName: string;
    entityName: string;
  };
  feedback: {
    feedbackType: string;
  };
  isAllOutletSelected: boolean;
  outlets: {
    [outletId: string]: boolean;
  };
};

export type FilterQueryValue = {
  entityId?: string;
  guestType?: string | null;
  guestCategory?: string | null;
};

export type DateRangeValue = {
  end: string; // Assuming end is always a string in ISO 8601 format
  label: string;
  start: string; // Assuming start is always a string in ISO 8601 format
};

export type DateRangeQueryValue = {
  toDate?: number;
  fromDate?: number;
};

export type FeedbackQueryValue = {
  type?: string;
  outlets?: {
    [outletId: string]: boolean;
  };
};
