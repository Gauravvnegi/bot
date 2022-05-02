import { get, set } from 'lodash';

export class EmailList {
  records: Email[];

  deserialize(input) {
    this.records = new Array<Email>();
    input?.forEach((item) => this.records.push(new Email().deserialize(item)));
    return this.records;
  }
}

export class Email {
  id: string;
  email: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, 'id', '')),
      set({}, 'email', get(input, 'smtpUserName', ''))
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
