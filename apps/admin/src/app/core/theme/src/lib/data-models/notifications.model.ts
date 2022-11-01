import { get, set } from 'lodash';
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

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'message', get(input, ['message'])),
      set({}, 'notificationType', get(input, ['notificationType'])),
      set({}, 'read', get(input, ['read'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'userAgent', get(input, ['userAgent'])),
      set({}, 'userId', get(input, ['userId']))
    );
    this.message =
      this.message.length > 33
        ? this.message.substring(0, 33) + '...'
        : this.message;
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
