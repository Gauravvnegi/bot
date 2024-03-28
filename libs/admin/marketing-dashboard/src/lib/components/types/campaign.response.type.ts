type IndividualRecipient = {
  name: string;
};

type ListingRecipient = {
  receiverId: string;
  name: string;
};

type Subject = {
  salutation: string;
  firstName: string;
  lastName: string;
  text: string;
};

type StatsCampaign = {
  delivered: number;
  unopened: number;
  clicked: number;
  opened: number;
  failed: number;
  read: number;
  sent: number;
};

export type CampaignResponse = {
  id: string;
  name: string;
  channel: string;
  topicId: string;
  from: string;
  to: {
    individual: IndividualRecipient[];
    subscribers: any[]; // Not specified in the provided JSON
    listing: ListingRecipient[];
  };
  cc: string[];
  bcc: string[];
  subject: Subject;
  archieved: boolean;
  message: string;
  sentCount: number;
  active: boolean;
  statsCampaign: StatsCampaign;
  entityId: string;
  templateId: string;
  templateName: string;
  topicName: string;
  campaignType: string;
  isSchedule: boolean;
  dateTime: number;
  zoneId: string;
  isDraft: boolean;
  delayTime: number;
  tags: string[];
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
};

export type CampaignListResponse = {
  total: number;
  entityTypeCounts: {
    ONE_TIME: number;
    TRIGGERED: number;
  };
  entityStateCounts: {
    ACTIVE: number;
    INACTIVE: number;
    DRAFT: number;
    ARCHIVE: number;
    SENT: number;
  };
  records: CampaignResponse[];
  entityChannelCount: {
    WHATSAPP: number;
    EMAIL: number;
  };
};
//

export type EMarketStatsResponse = {
  readEventStats: { [key: string]: number };
  sentEventStats: { [key: string]: number };
  deliveredEventStats: { [key: string]: number };
  failedEventStats: { [key: string]: number };
  clickedEventStats: { [key: string]: number };
  openEventStats: { [key: string]: number };
  unOpenEventStats: { [key: string]: number };
  campaignStats: CampaignStats;
  previousCampaignStats: PreviousCampaignStats;
  comparisonPercent: number;
  score: number;
};

export type CampaignStats = {
  delivered: number;
  unopened: number;
  clicked: number;
  opened: number;
  failed: number;
  read: number;
  sent: number;
  deliveryRate: number;
  conversionRate: number;
};

export interface PreviousCampaignStats {
  delivered: number;
  unopened: number;
  clicked: number;
  opened: number;
  failed: number;
  read: number;
  sent: number;
  deliveryRate: number;
  conversionRate: number;
}
