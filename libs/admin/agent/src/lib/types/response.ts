import { EntityState } from '@hospitality-bot/admin/shared';

export type AgentTableResponse = {
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
  priceModifierValue: string;
  iataNumber: string;
  isVerified: boolean;
  status?: boolean;
  code?: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
  };
  companyId: string;
  company?: AgentTableResponse;
  gender?: string;
  dateOfBirth?: string;
};

export type AgentListResponse = {
  records: AgentTableResponse[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};
