import { Injectable } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AdminUtilityService {
  constructor() {}

  makeQueryParams(queries = [], callingMethod?) {
    if (!queries.length) {
      return;
    }

    const queryObj = queries.reduce((acc, curr) => {
      for (let key in curr) {
        // TO_DO: Readme
        if (curr[key]) {
          if (acc[key]) {
            acc[key] = [acc[key], curr[key]].join(',');
          } else if (curr[key] !== null && curr[key] !== undefined) {
            acc[key] = curr[key];
          }
        }
      }

      return { ...acc };
    }, {});

    let queryStr = '';

    queryStr = Object.keys(queryObj)
      .map((key) => `${key}=${queryObj[key]}`)
      .join('&');

    return `?${queryStr}`;
  }

  getToDate(globalQueries) {
    return globalQueries.map((data) => {
      if (data.toDate) {
        return data.toDate;
      }
    }).join('');
  }

}
