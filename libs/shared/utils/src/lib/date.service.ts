import { Injectable } from '@angular/core';
import { difference } from 'lodash';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  private constructor() {}

  getCurrentTimeStamp() {
    return moment();
  }

  static convertDateToTimestamp(inputDate) {
    return moment(inputDate).unix();
  }

  static convertTimestampToDate(inputTimeStamp, format?) {
    if (format) {
      return moment.unix(inputTimeStamp / 1000).format(format);
    }
    return moment.unix(inputTimeStamp / 1000).format('DD-MM-YYYY');
  }

  static currentDate(format?) {
    return DateService.convertTimestampToDate(moment.now(), format);
  }

  static getCurrentDateString() {
    return moment().format();
  }

  static getCurrentDateWithFormat(format: string = 'DD-MM-YYYY') {
    return moment().format(format);
  }

  static getDateDifference(date1, date2) {
    return moment(date1).diff(moment(date2), 'days');
  }

  static getMonthFromDate(timestamp) {
    return moment.unix(timestamp / 1000).month();
  }

  static getYearFromDate(timestamp) {
    return moment.unix(timestamp / 1000).year();
  }

  static getCurrentTimeZone() {
    return moment().format('Z');
  }

  static getDateFromTimeStamp(inputTimeStamp, format = 'DD-MM-YYYY') {
    return moment(inputTimeStamp).format(format);
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
}
