import { DateService } from '@hospitality-bot/shared/utils';
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
  toReceivers;
  topicId: string;
  updatedAt: number;
  ccReceivers;
  bccReceivers;
  to;
  cc;
  bcc;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'status', get(input, ['active'])),
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
      set({}, 'toReceivers', get(input, ['to'])),
      set({}, 'ccReceivers', get(input, ['to'])),
      set({}, 'bccReceivers', get(input, ['to'])),
      set({}, 'topicId', get(input, ['topicId'])),
      set({}, 'updatedAt', get(input, ['updatedAt']))
    );
    return this;
  }

  getDraftDate(timezone = '+05:30') {
    if (this.updatedAt) {
      return DateService.getDateFromTimeStamp(
        this.updatedAt,
        'DD/M/YY',
        timezone
      );
    }
    return DateService.getDateFromTimeStamp(
      this.createdAt,
      'DD/M/YY',
      timezone
    );
  }
}
