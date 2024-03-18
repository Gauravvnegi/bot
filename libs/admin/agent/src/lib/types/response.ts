import { EntityState } from '@hospitality-bot/admin/shared';
import { AdditionalFeature } from 'libs/admin/company/src/lib/types/response';

export type AgentTableResponse = AdditionalFeature & {
  id?: string;
  salutation?: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  nationality: string;
  age?: number;
  type: string;
  priceModifier: string;
  priceModifierType: string;
  priceModifierValue: string;
  iataNumber: string;
  isVerified: boolean;
  status?: boolean;
  code?: string;
  address: GuestAddress;
  companyId?: string;
  agencyName?: string;
  creditLimit: number;
  creditLimitUsed?: number;
  gender?: string;
  dateOfBirth?: number;
  created?: number;
  value?: string;
  label?: string;
  extras?: string;
  salesPersonName?: string;
};

export type AgentListResponse = {
  records: AgentTableResponse[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};

export type GuestAddress = {
  addressLine1: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
  id?: string;
};
