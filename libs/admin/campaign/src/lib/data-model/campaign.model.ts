import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class Campaigns implements Deserializable {
  records: Campaign[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Campaign().deserialize(record)
    );
    return this;
  }
}

export class Campaign implements Deserializable {
  id: string;
  status: boolean;
  description: string;
  name: string;
  hotelId: string;
  active: boolean;
  topicId: string;
  templateType: string;
  htmlTemplate: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'topicId', get(input, ['topicId'])),
      set({}, 'templateType', get(input, ['templateType'])),
      set({}, 'htmlTemplate', get(input, ['htmlTemplate']))
    );
    return this;
  }
}
