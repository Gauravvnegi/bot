import { Address, EntityConfig, EntitySubType, EntityType, SocialPlatforms } from "@hospitality-bot/admin/shared";

export type EntityTabFilterResponse = {
  entityId: string[];
  feedbackType: string;
  entityType?: string;
  entitySubType?: string;
};

export type EntityTabFilterConfig = {
  isAllOutletTabFilter: boolean;
  isSticky: boolean;
  extraGap: number;
  entityId: string;
  globalFeedbackFilterType: string;
};

export type globalQueryValueType = {
  property: {
    brandName: string;
    entityName: string;
  };
  feedback: {
    feedbackType: string;
  };
  isAllOutletSelected: boolean;
  outlets: {
    [outletId: string]: boolean;
  };
};

export type Branch = {
  id: string;
  category: EntityType;
  name: string;
  logo: string;
  address: Address;
  websiteUrl?: string;
  socialPlatforms: SocialPlatforms[];
  nationality: string;
  status: string;
  parentId: string;
  entities?: EntityConfig[];
  timezone: string;
  type: EntitySubType;
};

export type Outlet = {
  id: string;
  category: string;
  name: string;
  logo: string;
  address;
  status: string;
  parentId: string;
  entities: any[]; // You can specify a more specific export type if needed
  timezone: string;
  type: string;
};

export type FeedbackType = 'ALL' | 'TRANSACTIONALFEEDBACK' | 'STAYFEEDBACK';
