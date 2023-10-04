import { EntityState } from '@hospitality-bot/admin/shared';

export type OfferListResponse = {
  offers: OfferResponse[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
};

export type OfferResponse = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  packageCode: string;
  imageUrl: { isFeatured: boolean; url: string }[];
  source: string;
  entityId: string;
  autoAccept: boolean;
  hasChild: boolean;
  discountType: string;
  discountValue: number;
  discountedPrice: number;
  subPackages: any[];
  roomTypes: any[];
};

export type SearchResult = {
  id: string;
  name: string;
  type: string;
  rate?: number;
  currency: string;
  discountedPrice?: number;
  originalPrice?: number;
};
