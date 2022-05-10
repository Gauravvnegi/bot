import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class Templates {
  records: ITemplate[];
  deserialize(input) {
    this.records = new Array<ITemplate>();
    input?.records?.forEach((template) =>
      this.records.push(new Template().deserialize(template))
    );
    return this;
  }
}

export class Template {
  id: string;
  status: boolean;
  description: string;
  name: string;
  entityId: string;
  active: boolean;
  topicId: string;
  templateType: string;
  htmlTemplate: string;
  templates: Template;
  isShared: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'entityId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'topicId', get(input, ['topicId'])),
      set({}, 'templateType', get(input, ['templateType'])),
      set({}, 'htmlTemplate', get(input, ['htmlTemplate'])),
      set({}, 'isShared', get(input, ['isShared'])),
      set({}, 'template', new Templates().deserialize(input.template).records)
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

export type ITemplate = Omit<Template, 'deserialize'>;
export type ITopic = Omit<Topic, 'deserialize'>;
export type ITopics = Omit<Topics, 'deserialize'>;
