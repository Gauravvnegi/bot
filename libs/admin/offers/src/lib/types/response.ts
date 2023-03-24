import { EntityStateCountsResponse } from 'libs/admin/library/src/lib/types/response';

export type OfferListResponse = {
  offers: OfferResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
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
  imageUrl: string;
  source: string;
  hotelId: string;
  autoAccept: boolean;
  hasChild: boolean;
  discountType: string;
  discountValue: number;
  discountedPrice: number;
  subPackages: any[];
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
