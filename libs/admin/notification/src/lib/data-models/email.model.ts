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
  value: string;
  label: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'value', get(input, 'id', '')),
      set({}, 'label', get(input, 'smtpUserName', ''))
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
  value: string;
  status: boolean;
  description: string;
  label: string;
  entityId: string;
  active: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'value', get(input, ['id'])),
      set({}, 'label', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'entityId', get(input, ['entityId'])),
      set({}, 'active', get(input, ['active']))
    );
    return this;
  }
}
