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
  foodItems: {
    category: string;
    deliveryPrice: number;
    description: string;
    dineInPrice: number;
    entityId: string;
    hsnCode: string;
    id: string;
    mealPreference: string;
    name: string;
    preparationTime: number;
    quantity: number;
    status: boolean;
    type: string;
    unit: string;
    currency: string;
  }[];
  enableOnMicrosite: boolean;
  priority: string;
};

export type SearchResult = {
  id: string;
  name: string;
  type: string;
  rate?: number;
  currency: string;
  discountedPrice?: number;
  originalPrice?: number;
  dineInPrice?: number;
  deliveryPrice?: number;
};
