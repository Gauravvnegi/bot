import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { get, set } from 'lodash';
import * as moment from 'moment';
export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class RequestTable implements Deserializable {
  records: Request[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new Request().deserialize(record)
    );
    return this;
  }
}

export class Request implements Deserializable {
  id;
  requestTimeStamp;
  remarks;
  journey;
  status;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'requestTimeStamp', get(input, ['requestTime'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'journey', get(input, ['journey']))
    );
    return this;
  }

  getRequestDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.requestTimeStamp,
      'DD/M/YY',
      timezone
    );
  }

  getRequestTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.requestTimeStamp,
      'HH:mm',
      timezone
    );
  }

  getElapsedTime(timezone = '+05:30') {
    const diffInMins = moment()
      .utcOffset(timezone)
      .diff(moment(this.requestTimeStamp).utcOffset(timezone), 'minutes');
    if (diffInMins > 24 * 60 * 30 * 12) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'years'
        )} year(s)`;
    } else if (diffInMins > 24 * 60 * 30) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'months'
        )} month(s)`;
    } else if (diffInMins > 24 * 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'days'
        )} day(s)`;
    } else if (diffInMins > 60) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'hours'
        )} hour(s)`;
    } else if (diffInMins > 0) {
      return `${moment()
        .utcOffset(timezone)
        .diff(
          moment(this.requestTimeStamp).utcOffset(timezone),
          'minutes'
        )} min(s)`;
    } else {
      return;
    }
  }
}
