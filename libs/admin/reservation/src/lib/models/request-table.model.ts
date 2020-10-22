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
  requestTimeStamp;
  remarks;
  journey;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'requestTimeStamp', get(input, ['requestTime'])),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'journey', get(input, ['journey']))
    );
    return this;
  }

  getRequestDate() {
    return moment(this.requestTimeStamp).format('DD/M/YY');
  }

  getRequestTime() {
    return moment(this.requestTimeStamp).format('HH:mm');
  }

  getElapsedTime() {
    const diffInMins = moment().diff(moment(this.requestTimeStamp), 'minutes');
    if (diffInMins > 24 * 60 * 30 * 12) {
      return `${moment().diff(moment(this.requestTimeStamp), 'years')} year`;
    } else if (diffInMins > 24 * 60 * 30) {
      return `${moment().diff(moment(this.requestTimeStamp), 'months')} month`;
    } else if (diffInMins > 24 * 60) {
      return `${moment().diff(moment(this.requestTimeStamp), 'days')} day`;
    } else if (diffInMins > 60) {
      return `${moment().diff(moment(this.requestTimeStamp), 'hours')} hour`;
    } else if (diffInMins > 0) {
      return `${moment().diff(moment(this.requestTimeStamp), 'minutes')} min`;
    } else {
      return;
    }
  }
}
