import { create, get, set } from 'lodash';
import * as moment from 'moment';

export class NotificationList {
  records: Notification[];

  deserialize(input) {
    this.records = new Array<Notification>();

    input.forEach((item) =>
      this.records.push(new Notification().deserialize(item))
    );
    return this.records;
  }
}

export class Notification {
  active: boolean;
  created: number;
  id: string;
  message: string;
  notificationType: string;
  read: boolean;
  updated: number;
  userAgent: string;
  userId: string;
  data;

  deserialize(input) {
    this.id = input.id || '';
    this.active = input.active || '';
    this.created = input.created || '';
    this.message = decodeURIComponent(
      input.message || ''.replace(/\n/g, '<br/>')
    );
    this.notificationType = input.notificationType || '';
    this.read = input.read || false;
    this.updated = input.updated || '';
    this.data = input.data;
    return this;
  }

  getTime(timezone = '+05:30') {
    const diff = moment()
      .utcOffset(timezone)
      .diff(moment(+this.updated).utcOffset(timezone), 'days');
    const currentDay = moment().format('DD');
    const lastMessageDay = moment
      .unix(+this.updated / 1000)
      .utcOffset(timezone)
      .format('DD');
    if (diff > 0) {
      return moment(this.updated).utcOffset(timezone).format('DD MMM');
    } else if (+diff === 0 && +currentDay > +lastMessageDay) {
      return 'Yesterday';
    }
    return moment(this.updated).utcOffset(timezone).format('h:mm a');
  }
}
