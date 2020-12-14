import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  constructor() {}

  convertDateToTimestamp(inputDate) {
    return moment(inputDate).unix();
  }

  convertTimestampToDate(inputTimeStamp, format?) {
    if (format) {
      return moment.unix(inputTimeStamp / 1000).format(format);
    }
    return moment.unix(inputTimeStamp / 1000).format('DD-MM-YYYY');
  }

  currentDate(format?) {
    return this.convertTimestampToDate(moment.now(), format);
  }

  getCurrentDateString() {
    return moment().format();
  }

  getCurrentDateWithFormat(format: string = 'DD-MM-YYYY') {
    return moment().format(format);
  }

  getDateDifference(date1, date2) {
    return moment(date1).diff(moment(date2), 'days');
  }

  getMonthFromDate(timestamp) {
    return moment.unix(timestamp / 1000).month();
  }

  getYearFromDate(timestamp) {
    return moment.unix(timestamp / 1000).year();
  }

  getCurrentTimeZone() {
    return moment().format('Z');
  }

  getDateFromTimeStamp(inputTimeStamp, format = 'DD-MM-YYYY') {
    return moment(inputTimeStamp).format(format);
  }
}
