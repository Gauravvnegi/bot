import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class ListTable {
  records: IList[];

  deserialize(input) {
    this.records = new Array<IList>();
    input?.records?.forEach((list, i) =>
      this.records.push(new List().deserialize(list, i))
    );
    return this;
  }
}

export class List {
  active: boolean;
  associateContactWithFollowingTags: string;
  createdAt: number;
  createdBy: string;
  description: string;
  id: string;
  marketingContacts: IContact;
  name: string;
  stats: IListStatistic;
  topicName: string;

  deserialize(input, index) {
    Object.assign(
      this,
      set({}, 'active', get(input, ['active'])),
      set(
        {},
        'associateContactWithFollowingTags',
        get(input, ['associateContactWithFollowingTags'])
      ),
      set({}, 'createdAt', get(input, ['createdAt'])),
      set({}, 'createdBy', get(input, ['createdBy'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'topicName', get(input, ['topicName'])),
      set(
        {},
        'marketingContacts',
        new ContactList().deserialize(input.marketingContacts).records
      ),
      set({}, 'stats', new ListStatistic().deserialize(input.stats))
    );
    return this;
  }
}

export class ContactList {
  records: IContact[];

  deserialize(input) {
    this.records = new Array<IContact>();
    input?.forEach((contact, i) =>
      this.records.push(new Contact().deserialize(contact, i))
    );
    return this;
  }
}

export class Contact {
  companyName: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  mobile: string;
  salutation: string;

  deserialize(input, index) {
    Object.assign(
      this,
      set({}, 'companyName', get(input, ['companyName'])),
      set({}, 'email', get(input, ['email'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'mobile', get(input, ['mobile'])),
      set({}, 'id', get(input, ['id'], index)),
      set({}, 'salutation', get(input, ['salutation'], ''))
    );
    return this;
  }
}

export class ListStatistic implements IDeserializable {
  totalContacts: number;
  unsubscribed: number;
  bounce: number;
  sendCampaign: number;
  scheduleCampaign: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'totalContacts', get(input, ['totalContacts'])),
      set({}, 'unsubscribed', get(input, ['unsubscribed'])),
      set({}, 'bounce', get(input, ['bounce'])),
      set({}, 'sendCampaign', get(input, ['sendCampaign'])),
      set({}, 'scheduleCampaign', get(input, ['scheduleCampaign']))
    );
    return this;
  }
}

export class Topics {
  records: Topic[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Topic().deserialize(record)
    );
    return this;
  }
}

export class Topic {
  id: string;
  status: boolean;
  description: string;
  name: string;
  hotelId: string;
  active: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active']))
    );
    return this;
  }
}

export type IList = Omit<List, 'deserialize'>;
export type IContact = Omit<Contact, 'deserialize'>;
export type IListStatistic = Omit<ListStatistic, 'deserialize'>;
export type ITopic = Omit<Topic, 'deserialize'>;
export type ITopics = Omit<Topics, 'deserialize'>;
