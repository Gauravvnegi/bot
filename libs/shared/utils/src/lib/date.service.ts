import { Injectable } from '@angular/core';
import { difference } from 'lodash';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  private constructor() {}

  getCurrentTimeStamp() {
    return moment().unix() * 1000;
  }

  static convertDateToTimestamp(inputDate) {
    return moment(inputDate).unix();
  }

  static convertTimestampToDate(inputTimeStamp, format?, timezone = '+05:30') {
    if (format) {
      return moment.unix(inputTimeStamp / 1000).format(format);
    }
    return moment.unix(inputTimeStamp / 1000).format('DD-MM-YYYY');
  }

  static currentDate(format?) {
    return DateService.convertTimestampToDate(moment.now(), format);
  }

  static getCurrentDateString(timezone = '+05:30') {
    return moment().utcOffset(timezone).format();
  }

  static getCurrentDateWithFormat(
    format: string = 'DD-MM-YYYY',
    timezone = '+05:30'
  ) {
    return moment().utcOffset(timezone).format(format);
  }

  static getDateDifference(date1, date2, timezone = '+05:30') {
    return moment(date1).utcOffset(timezone).diff(moment(date2), 'days');
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

  convertTimestampToLabels(type, timestamp, format?, toDate?) {
    let returnData = '';
    if (type === 'year') {
      returnData = timestamp;
    } else if (type === 'month') {
      returnData = moment(+timestamp).format(format || 'MMM YYYY');
    } else if (type === 'date') {
      returnData = moment(+timestamp).format(format || 'DD MMM');
    } else if (type === 'week') {
      let difference = DateService.getDateDifference(+toDate, +timestamp);
      difference = difference >= 0 && difference < 6 ? difference : 6;
      let monthDiff =
        DateService.getMonthFromDate(moment(+timestamp)) ===
        DateService.getMonthFromDate(moment(+timestamp).add(6, 'days'));
      returnData = difference
        ? moment(+timestamp).format(monthDiff ? 'D' : format || 'D MMM') +
          '-' +
          moment(+timestamp)
            .add(difference, 'days')
            .format(format || 'DD MMM')
        : moment(+timestamp).format(format || 'D MMM');
    } else {
      returnData = `${timestamp > 12 ? timestamp - 12 : timestamp}:00 ${
        timestamp > 11 ? 'PM' : 'AM'
      }`;
    }
    return returnData;
  }

  getCalendarType(startDate, endDate) {
    const dateDiff = DateService.getDateDifference(startDate, endDate);
    if (dateDiff === 0) {
      return 'day';
    } else if (dateDiff > 0 && dateDiff <= 7) {
      return 'date';
    } else if (dateDiff > 7 && dateDiff < 30) {
      return 'week';
    } else if (dateDiff >= 30 && dateDiff < 365) {
      if (
        DateService.getMonthFromDate(startDate) ===
          DateService.getMonthFromDate(endDate) &&
        DateService.getYearFromDate(startDate) ===
          DateService.getYearFromDate(endDate)
      ) {
        return 'week';
      }
      return 'month';
    } else {
      if (
        DateService.getYearFromDate(startDate) ===
        DateService.getYearFromDate(endDate)
      ) {
        return 'month';
      }
      return 'year';
    }
  }

  static sortObjArrayByTimeStamp(arr, field, order = 'asc') {
    if (order === 'asc') {
      return arr?.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    }
    return arr?.sort((a, b) => (a[field] < b[field] ? 1 : -1));
  }
}
