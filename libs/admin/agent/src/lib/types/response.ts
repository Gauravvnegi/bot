import { EntityState } from '@hospitality-bot/admin/shared';

export type AgentResponseType = {
  id?: string;
  nameTitle?: string;
  firstName: string;
  lastName?: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  nationality?: string;
  age?: number;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
  };
  iataNumber?: string;
  priceModifier?: string; //'COMMISSION';
  priceModifierType: string; //'PERCENTAGE';
  priceModifierValue: string;
  companyId: string;
  code?: string;
  commission?: string;
  action?: boolean;
};

export type AgentListResponse = {
  records: AgentResponseType[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};
