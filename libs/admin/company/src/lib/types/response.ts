import { EntityState } from '@hospitality-bot/admin/shared';

export type CompanyResponseType = {
  id?: string;
  code?: string;
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
    city?: string;
    state?: string;
    countryCode?: string;
    postalCode: string;
  };
  salesPersonName: string;
  salesPersonPhone: string;
  iataNumber?: string;
  priceModifier: string;
  priceModifierValue: string;
  companyName?: string;
  companyCode?: number;
  status?: boolean;
};

export type CompanyListResponse = {
  records: CompanyResponseType[];
  total: number;
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
};
