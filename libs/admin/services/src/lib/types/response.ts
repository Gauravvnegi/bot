import { EntityStateCountsResponse } from 'libs/admin/library/src/lib/types/response';

export type ServiceListResponse = {
  services?: ServiceResponse[];
  paidPackages?: ServiceResponse[];
  complimentaryPackages?: ServiceResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
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
};
