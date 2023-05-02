import { EntityTypeCountsResponse } from '@hospitality-bot/admin/library';
import { EntityStateCountsResponse } from 'libs/admin/library/src/lib/types/response';

export type ServiceListResponse = {
  services?: ServiceResponse[];
  paidPackages?: ServiceResponse[];
  complimentaryPackages?: ServiceResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
  entityTypeCounts: EntityTypeCountsResponse;
};

export type ServiceResponse = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: string;
  hotelId: string;
  source: string;
  type: string;
  unit: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
  categoryName: string;
  enableVisibility: string[];
  taxIds: string[];
};

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
