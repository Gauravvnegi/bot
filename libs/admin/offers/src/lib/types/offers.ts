import { LibrarySearchItem } from '@hospitality-bot/admin/library';

export type OfferFormData = {
  active: boolean;
  name: string;
  libraryItems: { label: string; value: string; type: LibrarySearchItem }[];
  imageUrl: string;
  description: string;
  startDate: number;
  endDate: number;
  discountType: string;
  discountValue: number;
};

export type OfferData = Omit<OfferFormData, 'libraryItems'> & {
  source: 1;
  type: 'OFFER';
} & OffersOnEntity;

export type OffersOnEntity = {
  serviceIds: string[];
  packageIds: string[];
  roomTypeIds: string[];
};
