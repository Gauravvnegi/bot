import { Injectable } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AdminUtilityService {
  constructor(private _dateService: DateService) {}

  makeQueryParams(queries = [], callingMethod?) {
    if (!queries.length) {
      return;
    }

    const queryObj = queries.reduce((acc, curr) => {
      for (let key in curr) {
        if (acc[key]) {
          acc[key] = [acc[key], curr[key]].join(',');
        } else if (curr[key] !== null && curr[key] !== undefined) {
          acc[key] = curr[key];
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

  convertTimestampToLabels(type, data) {
    let returnTime;
    if (type === 'year') {
      returnTime = data;
    } else if (type === 'month') {
      returnTime = moment.unix(data).format('MMM YYYY');
    } else if (type === 'date') {
      returnTime = this._dateService.convertTimestampToDate(data, 'DD MMM');
    } else {
      returnTime = `${data > 12 ? data - 12 : data}:00 ${
        data > 11 ? 'PM' : 'AM'
      }`;
    }
    return returnTime;
  }

  getCalendarType(startDate, endDate) {
    const dateDiff = this._dateService.getDateDifference(startDate, endDate);
    if (dateDiff === 0) {
      return 'day';
    } else if (dateDiff > 0 && dateDiff < 30) {
      return 'date';
    } else if (dateDiff >= 30 && dateDiff <=365) {
      if (this._dateService.getMonthFromDate(startDate) === this._dateService.getMonthFromDate(endDate)) {
        return 'date';
      }
      return 'month';
    } else {
      if (this._dateService.getYearFromDate(startDate) === this._dateService.getYearFromDate(endDate)) {
        return 'month';
      }
      return 'year';
    }
  }
}
