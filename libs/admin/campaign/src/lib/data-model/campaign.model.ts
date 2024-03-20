import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import { EntityState, IDeserializable } from '@hospitality-bot/admin/shared';
import { CampaignType } from '../types/campaign.type';

export class Campaigns implements IDeserializable {
  records: Campaign[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  entityChannelCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: any) {
    this.records = input.records.map((record: any) =>
      new Campaign().deserialize(record)
    );
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    this.entityChannelCounts = input?.entityChannelCount;
    this.totalRecord = input?.total;
    return this;
  }
}

export class Campaign implements IDeserializable {
  id: string;
  name: string;
  entityId: string;
  active: boolean;
  statsCampaign;
  templateName: string;
  topicName: string;
  isDraft: boolean;
  archieved: true;
  campaignType: string;
  createdAt: number;
  channel: CampaignType;
  from: string;
  message: string;
  previewText: string;
  sentCount: number;
  subject: string;
  templateId: string;
  testEmails: string[];
  toReceivers;
  topicId: string;
  updatedAt: number;
  to;
  cc: string[];
  bcc: string[];
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'channel', get(input, ['channel'])),
      set({}, 'status', get(input, ['active'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'statsCampaign', get(input, ['statsCampaign'])),
      set({}, 'templateName', get(input, ['templateName'])),
      set({}, 'topicName', get(input, ['topicName'])),
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
      set({}, 'cc', get(input, ['cc'])),
      set({}, 'bcc', get(input, ['bcc'])),
      set({}, 'topicId', get(input, ['topicId'])),
      set({}, 'updatedAt', get(input, ['updatedAt']))
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
