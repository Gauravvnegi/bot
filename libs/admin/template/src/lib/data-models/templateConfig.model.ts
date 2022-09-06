import { get, set } from 'lodash';
import { DateService } from '@hospitality-bot/shared/utils';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class Templates implements IDeserializable {
  records: ITemplate[];
  deserialize(input) {
    this.records = new Array<ITemplate>();
    input?.records?.forEach((template) =>
      this.records.push(new Template().deserialize(template))
    );
    return this;
  }
}

export class Template implements IDeserializable {
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
  topicName: string;
  updatedAt: number;
  createdAt: number;

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
      set({}, 'topicName', get(input, ['topicName'])),
      set({}, 'templateType', get(input, ['templateType'])),
      set({}, 'htmlTemplate', get(input, ['htmlTemplate'])),
      set({}, 'isShared', get(input, ['isShared'])),
      set({}, 'template', new Templates().deserialize(input.template).records),
      set({}, 'updatedAt', get(input, ['updatedAt'])),
      set({}, 'createdAt', get(input, ['createdAt']))
    );
    return this;
  }
  getDraftDate(timezone = '+05:30', format = 'DD/M/YY') {
    if (this.updatedAt) {
      return DateService.getDateFromTimeStamp(this.updatedAt, format, timezone);
    }
    return DateService.getDateFromTimeStamp(this.createdAt, format, timezone);
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
