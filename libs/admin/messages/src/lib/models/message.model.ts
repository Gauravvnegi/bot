import { get, set } from 'lodash';
import * as moment from 'moment';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
export class Chats {
  messages: IChat[];
  receiver: any;

  deserialize(input) {
    this.messages = new Array<IChat>();
    Object.assign(this, set({}, 'receiver', get(input, ['receiver'])));

    input.messages?.forEach((message) => {
      this.messages.push(new Chat().deserialize(message));
    });

    return this;
  }
}

export class Chat {
  direction: string;
  status: string;
  text: string;
  timestamp: number;
  type: string;
  url: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'direction', get(input, ['direction'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'text', get(input, ['text'])),
      set({}, 'timestamp', get(input, ['timestamp'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'url', get(input, ['url']))
    );
    return this;
  }

  getTime() {
    return moment(this.timestamp).format('h:mm a');
  }
}

export class ContactList {
  contacts: IContact[];

  deserialize(input) {
    this.contacts = new Array<IContact>();

    input?.forEach((item) =>
      this.contacts.push(new Contact().deserialize(item))
    );

    this.contacts = DateService.sortObjArrayByTimeStamp(
      this.contacts,
      'lastMessageAt',
      'desc'
    );

    return this;
  }
}

export class Contact {
  email: string;
  lastMessageAt: number;
  name: string;
  phone: string;
  profileUrl: string;
  receiverId: string;
  reservationId: string;
  roomNo: string;
  descriptionMessage: string;
  enableSend: boolean;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'email', get(input, ['email'])),
      set({}, 'lastMessageAt', get(input, ['lastMessageAt'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'phone', get(input, ['phone'])),
      set({}, 'profileUrl', get(input, ['profileUrl'])),
      set({}, 'receiverId', get(input, ['receiverId'])),
      set({}, 'reservationId', get(input, ['reservationId'])),
      set({}, 'roomNo', get(input, ['roomNo'])),
      set({}, 'descriptionMessage', get(input, ['descriptionMessage']))
    );
    this.enableSend = this.checkEnableSend();
    return this;
  }

  getTime() {
    const diff = moment().diff(moment(+this.lastMessageAt), 'days');
    const currentDay = moment().format('DD');
    const lastMessageDay = moment.unix(+this.lastMessageAt / 1000).format('DD');
    if (diff > 0) {
      return moment(this.lastMessageAt).format('DD MMM');
    } else if (+diff === 0 && +currentDay > +lastMessageDay) {
      return 'Yesterday';
    }
    return moment(this.lastMessageAt).format('h:mm a');
  }

  checkEnableSend() {
    return +moment().diff(moment(+this.lastMessageAt), 'hours') <= 24;
  }
}

export type IChat = Omit<Chat, 'deserialize'>;
export type IChats = Omit<Chats, 'deserialize'>;
export type IContact = Omit<Contact, 'deserialize'>;
export type IContactList = Omit<ContactList, 'deserialize'>;
