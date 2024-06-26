import { EntityState } from '@hospitality-bot/admin/shared';

export type AdditionalFeature = {
  taxId?: string;
  creditLimit?: number;
  marketSegment?: string;
  businessSource?: string;
  billingInstructions?: string;
};

export type CompanyResponseType = AdditionalFeature & {
  id?: string;
  code?: string;
  salutation?: string;
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
    city?: string;
    state?: string;
    countryCode?: string;
    postalCode: string;
  };
  salesPersonName: string;
  salesPersonPhone: string;
  iataNumber?: string;
  priceModifier: string;
  priceModifierType?: string;
  priceModifierValue: string;
  companyName?: string;
  companyCode?: number;
  status?: boolean;
  created?: number;
  creditLimitUsed?: number;
  label?: string;
  value?: string;
};

export type CompanyListResponse = {
  records: CompanyResponseType[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};
