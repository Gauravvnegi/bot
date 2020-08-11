import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {
  constructor() {}

  convertDateToTimestamp(inputDate) {
    return moment(inputDate).unix();
  }

  convertTimestampToDate(inputTimeStamp) {
    return moment.unix(inputTimeStamp/1000).format("DD-MM-YYYY")
  }

  currentDate() {
    return this.convertTimestampToDate(moment.now());
  }
}
