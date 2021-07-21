import { get, set } from 'lodash';
import * as moment from 'moment';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
export class Chats {
  messages: IChat[];
  receiver: IContact;

  deserialize(input) {
    this.messages = new Array<IChat>();
    this.receiver = new Contact().deserialize(input.receiver);

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
  caption: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'direction', get(input, ['direction'])),
      set(
        {},
        'status',
        get(input, ['status']) ? get(input, ['status']) : 'sent'
      ),
      set({}, 'text', get(input, ['text'])),
      set({}, 'timestamp', get(input, ['timestamp'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'caption', get(input, ['caption']))
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

    // this.contacts = DateService.sortObjArrayByTimeStamp(
    //   this.contacts,
    //   'lastMessageAt',
    //   'desc'
    // );

    return this;
  }
}

export class Contact {
  email: string;
  lastMessageAt: number;
  lastInboundMessageAt: number;
  name: string;
  phone: string;
  profileUrl: string;
  receiverId: string;
  reservationId: string;
  roomNo: string;
  descriptionMessage: string;
  enableSend: boolean;
  color: string;

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
      set({}, 'descriptionMessage', get(input, ['descriptionMessage']) || ''),
      set({}, 'lastInboundMessageAt', get(input, ['lastInboundMessageAt']))
    );
    this.color = colors[Math.floor(Math.random() * colors.length)];
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
    return +moment().diff(moment(+this.lastInboundMessageAt), 'hours') <= 24;
  }

  getProfileNickName() {
    return this.name
      .split(' ')
      .map((i) => i.charAt(0))
      .join('')
      .toUpperCase();
  }
}

const colors = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

export type IChat = Omit<Chat, 'deserialize'>;
export type IChats = Omit<Chats, 'deserialize'>;
export type IContact = Omit<Contact, 'deserialize'>;
export type IContactList = Omit<ContactList, 'deserialize'>;
