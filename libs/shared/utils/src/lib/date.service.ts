import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  private constructor() {}

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
}
