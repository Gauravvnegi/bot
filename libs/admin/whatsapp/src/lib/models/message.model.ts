import { get, set } from 'lodash';
import * as moment from 'moment';

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
      set({}, 'text', get(input, ['text'])),
      set({}, 'mediaType', get(input, ['type'])),
      set({}, 'timestamp', get(input, ['timestamp'])),
      set({}, 'url', get(input, ['url'])),
      set({}, 'caption', get(input, ['caption']))
    );
    this.type = this.getType(input.type);
    this.fileName = this.getFileName(input.type);
    return this;
  }

  getTime() {
    return moment(this.timestamp).format('h:mm a');
  }

  getType(type) {
    if (type === undefined) return undefined;
    else if (type.includes('image')) return 'image';
    else if (type.includes('pdf')) return 'pdf';
    else if (type.includes('video')) return 'video';
    else if (type.includes('audio')) return 'audio';
    else return type;
  }

  getFileName(type) {
    if (type === undefined) return undefined;
    else if (type.includes('image'))
      return `image_${moment(this.timestamp)}.${type.split('/')[1]}`;
    else if (type.includes('pdf'))
      return `pdf_${moment(this.timestamp)}.${type.split('/')[1]}`;
    else if (type.includes('video'))
      return `video_${moment(this.timestamp)}.${type.split('/')[1]}`;
    else if (type.includes('audio'))
      return `audio_${moment(this.timestamp)}.${type.split('/')[1]}`;
  }
}

export class ContactList {
  contacts: IContact[];
  unreadContacts: number;

  deserialize(input) {
    this.contacts = new Array<IContact>();
    this.unreadContacts = 0;
    input?.forEach((item) =>
      this.contacts.push(new Contact().deserialize(item))
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
      set({}, 'lastInboundMessageAt', get(input, ['lastInboundMessageAt'])),
      set({}, 'unreadCount', get(input, ['unreadCount']))
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
