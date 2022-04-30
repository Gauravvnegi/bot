import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class Templates implements Deserializable {
  records: Template[];
  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Template().deserialize(record)
    );
    return this;
  }
}

export class Template implements Deserializable {
  id: string;
  status: boolean;
  description: string;
  name: string;
  hotelId: string;
  active: boolean;
  topicId: string;
  templateType:string;
  htmlTemplate:string;

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
