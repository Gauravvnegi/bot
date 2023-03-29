export type TaxResponse = {
  id: string;
  name: string;
  taxType: string;
  taxRate: string;
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
