import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import * as moment from 'moment';
import { InhouseData } from 'libs/admin/request/src/lib/data-models/inhouse-list.model';
import {
  Booking,
  Feedback,
  Room,
} from '../../../../reservation/src/lib/models/reservation-table.model';

export class Chats {
  messages: IChat[];
  receiver: IContact;

  deserialize(input, timezone) {
    this.messages = new Array<IChat>();
    this.receiver = new Contact().deserialize(input.receiver, timezone);

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
  mediaType: string;
  url: string;
  caption: string;
  fileName: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'direction', get(input, ['direction'])),
      set(
        {},
        'status',
        get(input, ['status']) ? get(input, ['status']) : 'sent'
      ),
      set({}, 'mediaType', get(input, ['type'])),
      set({}, 'timestamp', get(input, ['timestamp'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'caption', get(input, ['caption']))
    );
    if (input.text) {
      this.text = decodeURIComponent(get(input, ['text'])).replace(
        /\n/g,
        '<br/>'
      );
    }
    this.type = this.getType(input.type);
    this.fileName = this.getFileName(input.type);
    return this;
  }

  getTime(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(this.timestamp, 'h:mm a', timezone);
  }

  getType(type) {
    if (type === undefined) return undefined;
    else if (type.includes('image')) return 'image';
    else if (type.includes('pdf')) return 'pdf';
    else if (type.includes('video')) return 'video';
    else if (type.includes('audio')) return 'audio';
    else return type;
  }

  getFileName(type, timezone = '+05:30') {
    if (type === undefined) return undefined;
    else
      return `${DateService.getDateFromTimeStamp(
        this.timestamp,
        'MMM_DD_YYYY_hh:mm:ss',
        timezone
      )}.${type.split('/')[1].split(';')[0]}`;
  }
}

export class ContactList {
  contacts: IContact[];
  unreadContacts: number;

  deserialize(input, timezone) {
    this.contacts = new Array<IContact>();
    this.unreadContacts = 0;
    input?.forEach((item) =>
      this.contacts.push(new Contact().deserialize(item, timezone))
    );

    this.contacts.forEach((contact) => {
      if (contact.unreadCount) {
        this.unreadContacts += 1;
      }
    });

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
  unreadCount: number;
  guestId: string;
  deserialize(input, timezone) {
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
      set({}, 'lastInboundMessageAt', get(input, ['lastInboundMessageAt'])),
      set({}, 'unreadCount', get(input, ['unreadCount'])),
      set({}, 'guestId', get(input, ['guestId']))
    );
    this.descriptionMessage = decodeURIComponent(
      get(input, ['descriptionMessage']) || ''
    );
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.enableSend = this.checkEnableSend(timezone);
    return this;
  }

  getTime(timezone = '+05:30') {
    const diff = moment()
      .utcOffset(timezone)
      .diff(moment(+this.lastMessageAt).utcOffset(timezone), 'days');
    const currentDay = moment().format('DD');
    const lastMessageDay = moment
      .unix(+this.lastMessageAt / 1000)
      .utcOffset(timezone)
      .format('DD');
    if (diff > 0) {
      return moment(this.lastMessageAt).utcOffset(timezone).format('DD MMM');
    } else if (+diff === 0 && +currentDay > +lastMessageDay) {
      return 'Yesterday';
    }
    return moment(this.lastMessageAt).utcOffset(timezone).format('h:mm a');
  }

  checkEnableSend(timezone = '+05:30') { 
    return (
      +moment()
        .utcOffset(timezone)
        .diff(
          moment(+this.lastInboundMessageAt).utcOffset(timezone),
          'hours'
        ) <= 24
    );
  }

  getProfileNickName() {
    const nameList = this.name.split(' ');
    return nameList
      .map((i, index) => {
        if ([0, 1].includes(index)) return i.charAt(0);
        else return '';
      })
      .join('')
      .toUpperCase();
  }
}

export class RequestList {
  data: InhouseData[];

  deserialize(input) {
    this.data = new Array<InhouseData>();
    input.forEach((request) => {
      this.data.push(new InhouseData().deserialize(request));
    });

    return this;
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

export class GuestDetails {
  records: GuestDetail[];
  id: string;

  deserialize(input, colorMap) {
    this.records = new Array();
    input.forEach((item) => {
      this.records.push(new GuestDetail().deserialize(item, colorMap));
    });
    return this;
  }
}
export class GuestDetail {
  reservation: Reservation;
  type: string;
  subType: string;

  deserialize(input, colorMap) {
    if (input.guestReservation) {
      this.reservation = new Reservation().deserialize(
        input.guestReservation,
        input.subType,
        colorMap
      );
    }
    if (input.feedback)
      Object.assign(
        this,
        set({}, 'type', get(input, ['type'])),
        set({}, 'subType', get(input, ['subType']))
      );

    return this;
  }
}
export class Reservation {
  rooms: Room;
  feedback: Feedback;
  booking: Booking;
  type: string;
  deserialize(input: any, type: string, colorMap) {
    this.rooms = new Room().deserialize(input.stayDetails);
    this.booking = new Booking().deserialize(input);
    this.type = type;
    return this;
  }

  getTitle() {
    switch (this.type) {
      case 'UPCOMING':
        return 'Upcoming Booking';
      case 'PAST':
        return 'Past Booking';
      case 'PRESENT':
        return 'Current Booking';
    }
  }
}
