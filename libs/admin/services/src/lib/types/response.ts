import { EntityState } from '@hospitality-bot/admin/shared';
export type ServiceListResponse = {
  services?: ServiceResponse[];
  paidPackages?: ServiceResponse[];
  complimentaryPackages?: ServiceResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
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
  taxes: any[];
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
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};
