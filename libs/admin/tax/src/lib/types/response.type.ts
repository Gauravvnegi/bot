export type TaxResponse = {
  id: string;
  country: string;
  taxType: string;
  category: string;
  taxValue: string;
  status: boolean;
  entityId: string;
};

export type TaxListResponse = {
  records: TaxResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: any;
};

export type EntityStateCountsResponse = {
  All: number;
  Active: number;
  Inactive: number;
};
