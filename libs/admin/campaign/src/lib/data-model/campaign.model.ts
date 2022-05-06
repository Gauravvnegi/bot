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
  name: string;
  hotelId: string;
  active: boolean;
  statsCampaign;
  templateName: string;
  isDraft: boolean;
  archieved: true;
  campaignType: string;
  createdAt: number;
  entityId: string;
  from: string;
  message: string;
  previewText: string;
  sentCount: number;
  subject;
  templateId: string;
  testEmails;
  to;
  topicId: string;
  updatedAt: number;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'hotelId', get(input, ['hotelId'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'statsCampaign', get(input, ['statsCampaign'])),
      set({}, 'templateName', get(input, ['templateName'])),
      set({}, 'isDraft', get(input, ['isDraft'])),
      set({}, 'archieved', get(input, ['archieved'])),
      set({}, 'campaignType', get(input, ['campaignType'])),
      set({}, 'createdAt', get(input, ['createdAt'])),
      set({}, 'entityId', get(input, ['entityId'])),
      set({}, 'from', get(input, ['from'])),
      set({}, 'message', get(input, ['message'])),
      set({}, 'previewText', get(input, ['previewText'])),
      set({}, 'sentCount', get(input, ['sentCount'])),
      set({}, 'subject', get(input, ['subject', 'text'])),
      set({}, 'templateId', get(input, ['templateId'])),
      set({}, 'testEmails', get(input, ['testEmails'], [])),
      set({}, 'to', get(input, ['to'])),
      set({}, 'topicId', get(input, ['topicId'])),
      set({}, 'updatedAt', get(input, ['updatedAt']))
    );
    return this;
  }
}
