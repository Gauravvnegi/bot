import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  private constructor() {}

  static convertDateToTimestamp(inputDate, timezone = '+05:30') {
    return moment(inputDate).utcOffset(timezone).unix();
  }

  static convertTimestampToDate(inputTimeStamp, format?, timezone = '+05:30') {
    if (format) {
      return moment(inputTimeStamp).utcOffset(timezone).format(format);
    }
    return moment(inputTimeStamp).utcOffset(timezone).format('DD-MM-YYYY');
  }

  static currentDate(format?) {
    return DateService.convertTimestampToDate(moment.now(), format);
  }

  static getCurrentDateString(timezone = '+05:30') {
    return moment().utcOffset(timezone).format();
  }

  static getCurrentDateWithFormat(format = 'DD-MM-YYYY', timezone = '+05:30') {
    return moment().utcOffset(timezone).format(format);
  }

  static getDateDifference(date1, date2, timezone = '+05:30') {
    return moment(date1).utcOffset(timezone).diff(moment(date2), 'days');
  }

  static getMonthDifference(date1, date2, timezone = '+05:30') {
    return moment(date1).utcOffset(timezone).diff(moment(date2), 'months');
  }

  static getMonthFromDate(timestamp, timezone = '+05:30') {
    return moment
      .unix(timestamp / 1000)
      .utcOffset(timezone)
      .month();
  }

  static getYearFromDate(timestamp, timezone = '+05:30') {
    return moment
      .unix(timestamp / 1000)
      .utcOffset(timezone)
      .year();
  }

  static getCurrentTimeZone() {
    return moment().format('Z');
  }

  static getDateFromTimeStamp(
    inputTimeStamp,
    format = 'DD-MM-YYYY',
    timezone = '+05:30'
  ) {
    return moment(inputTimeStamp).utcOffset(timezone).format(format);
  }

  static sortObjArrayByTimeStamp(arr, field, order = 'asc') {
    if (order === 'asc') {
      return arr?.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    }
    return arr?.sort((a, b) => (a[field] < b[field] ? 1 : -1));
  }

  convertTimestampToLabels(type, timestamp, timezone, format?, toDate?) {
    let returnData = '';
    if (type === 'year') {
      returnData = timestamp;
    } else if (type === 'month') {
      returnData = moment(+timestamp)
        .utcOffset(timezone)
        .format(format || 'MMM YYYY');
    } else if (type === 'date') {
      returnData = moment(+timestamp)
        .utcOffset(timezone)
        .format(format || 'DD MMM');
    } else if (type === 'week') {
      let difference = DateService.getDateDifference(
        +toDate,
        +timestamp,
        timezone
      );
      difference = difference >= 0 && difference < 6 ? difference : 6;
      let monthDiff =
        DateService.getMonthFromDate(
          moment(+timestamp).utcOffset(timezone),
          timezone
        ) ===
        DateService.getMonthFromDate(
          moment(+timestamp)
            .utcOffset(timezone)
            .add(6, 'days'),
          timezone
        );
      returnData = difference
        ? moment(+timestamp)
            .utcOffset(timezone)
            .format(monthDiff ? 'D' : format || 'D MMM') +
          '-' +
          moment(+timestamp)
            .utcOffset(timezone)
            .add(difference, 'days')
            .format(format || 'DD MMM')
        : moment(+timestamp)
            .utcOffset(timezone)
            .format(format || 'D MMM');
    } else {
      returnData = `${timestamp > 12 ? timestamp - 12 : timestamp}:00 ${
        timestamp > 11 ? 'PM' : 'AM'
      }`;
    }
    return returnData;
  }

  getCalendarType(startDate, endDate, timezone): string {
    const dateDiff = DateService.getDateDifference(
      startDate,
      endDate,
      timezone
    );
    const monthDiff = DateService.getMonthDifference(
      startDate,
      endDate,
      timezone
    );
    if (dateDiff === 0) {
      return 'day';
    } else if (dateDiff > 0 && dateDiff <= 14) {
      return 'date';
    } else if (dateDiff > 14 && dateDiff <= 98) {
      return 'week';
    } else if (dateDiff > 98 && monthDiff <= 14) {
      return 'month';
    } else {
      return 'year';
    }
  }

  getCurrentTimeStamp(timezone = '+05:30') {
    return moment().utcOffset(timezone).unix() * 1000;
  }
}
