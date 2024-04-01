import { DateService } from '@hospitality-bot/shared/utils';
import { get, set } from 'lodash';
import {
  EntityState,
  IDeserializable,
  Option,
} from '@hospitality-bot/admin/shared';
import { CampaignType, TemplateType } from '../types/campaign.type';
import { CampaignResponse } from '../types/campaign.response';

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
      set({}, 'to', get(input, ['to'])),
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

export class CampaignFormData {
  campaignName: string;
  // topic: string;
  to: string[];
  event: string;
  startDate: number;
  endDate: number;
  campaignState: string;
  template: TemplateType;
  message: string;
  cc?: string[];
  bcc?: string[];
  campaignTags: string[];
  templateId: string;
  from: string;
  recipients: Option[];
  subject: string;
  id: string;
  templateName: string;

  deserialize(input: CampaignResponse) {
    this.campaignName = input?.name;
    // this.topic = input?.topicId;
    this.startDate = input?.dateTime;
    // this.campaignState = input.campaignType;
    this.message = input?.message;
    this.templateId = input?.templateId;
    this.templateName = input?.templateName;
    this.from = input?.from;
    this.subject = input?.subject?.text;
    this.cc = input?.cc;
    this.bcc = input?.bcc;
    this.campaignTags = input?.tags;
    this.id = input?.id;

    // Map individuals and listings in to array.
    const individualLabels = input?.to?.individual?.map((item) => item?.name);
    const listings = input?.to?.listing?.map((item) => ({
      label: item?.name,
      value: item?.receiverId,
    }));
    this.to = [...individualLabels, ...listings?.map((item) => item?.label)];
    this.recipients = listings;
    return this;
  }
}
