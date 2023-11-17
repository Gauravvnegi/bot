import { EntityState } from '@hospitality-bot/admin/shared';
import { ServiceResponse } from 'libs/admin/services/src/lib/types/response';

export type PackageResponse = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  imageUrl: { isFeatured: boolean; url: string }[];
  source: string;
  entityId: string;
  type: string;
  unit: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
  category: string;
  categoryName: string;

  // category: string;
  discountType: string;
  discountValue: number;
  discountedPrice: number;
  subPackages: ServiceResponse[];
  // enableVisibility: string[];
  // serviceIds: string[];
  enableOnMicrosite: boolean;
  priority: string;
};

export type PackageListResponse = {
  paidPackages: PackageResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};
