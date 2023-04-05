export type TaxResponse = {
  id: string;
  country: string;
  taxType: string;
  category: string;
  taxValue: string;
  status: boolean;
};

export type TaxListResponse = {
  records: TaxResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
};

export type EntityStateCountsResponse = {
  All: number;
  Active: number;
  Inactive: number;
};
