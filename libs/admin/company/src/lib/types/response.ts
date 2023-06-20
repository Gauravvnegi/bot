export type CompanyResponseType = {
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
    city?: string;
    state?: string;
    countryCode?: string;
    postalCode: string;
  };
  salesPersonName: string;
  salesPersonPhone: string;
  iataNumber?: string;
  priceModifier?: string;
  pricaModifierType: string;
  priceModifierValue: string;
  companyName?: string;
  companyCode?: number;
  action?: boolean;
};

export type CompanyListResponse = {
  records: CompanyResponseType[];
  total: number;
  entityTypeCounts: EntityCountsResponse;
};

export type EntityCountsResponse = {
  Active: number;
  Inactive: number;
};
