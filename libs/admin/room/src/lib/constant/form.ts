import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { AddRoomTypes } from '../types/room';

export enum ServicesTypeValue {
  PAID = 'PAID',
  COMPLIMENTARY = 'COMPLIMENTARY',
}

export const iteratorFields: Record<AddRoomTypes, IteratorField[]> = {
  single: [
    {
      label: 'Room No.',
      name: 'roomNo',
      type: 'input',
      required: true,
    },
    {
      label: 'Floor',
      name: 'floorNo',
      type: 'input',
      required: true,
    },
  ],
  multiple: [
    {
      label: 'From',
      name: 'from',
      type: 'input',
      required: true,
    },
    {
      label: 'To',
      name: 'to',
      type: 'input',
      required: true,
    },
    {
      label: 'Floor No.',
      name: 'floorNo',
      type: 'input',
      required: true,
    },
  ],
};

export type RoomTypeFormData = {
  status: boolean;
  name: string;
  imageUrls: string[];
  description: string;
  complimentaryAmenities: string[];
  paidAmenities: string[];
  staticRatePlans?: StaticPricingRatePlan;
  dynamicRatePlans?: DynamicPricingRatePlan;
  ratePlans: AddedRatePlans[];
  maxOccupancy: number;
  maxChildren: number;
  maxAdult: number;
  area: number;
};

// export type RoomTypeModData = Omit<RoomTypeData, 'ratePlans'> & {
//   ratePlans: StaticPricingMod[];
// };

// export type StaticPricingMod = Omit<
//   StaticPricingRatePlan,
//   'discountType' | 'discountValue' | 'label'
// > & {
//   discount: {
//     type: string;
//     value: number;
//   };
//   id: string;
// };

export type StaticPricingMod = Omit<RatePlan, 'discountType' | 'discountValue'>;

export type StaticPricingRatePlan = RatePlan & {
  discountType: string;
  discountValue: number;
  bestPriceCurrency: string;
  bestAvailablePrice: number;
};

export type DynamicPricingRatePlan = RatePlan & {
  maxPriceCurrency: string;
  maxPrice: number;
  minPriceCurrency: string;
  minPrice: number;
};

export type RatePlan = {
  paxPriceCurrency: string;
  paxChildPrice: number;
  paxAdultPrice: number;
  label: string;
  ratePlanId?: string | null;
  basePriceCurrency: string;
  basePrice: number;
};

export type AddedRatePlans = {
  label: string;
  description?: string;
  currency: string;
  extraPrice: number;
  discount?: {
    type: string;
    value: number;
  };
  ratePlanId?: string;
  status: boolean;
};

export type RoomTypeData = Omit<
  RoomTypeFormData,
  'complimentaryAmenities' | 'paidAmenities'
> & {
  roomAmenityIds: string[];
};

export const errorMessages = {
  required: 'This is a required field.',
  isPriceLess: 'Price cannot be less than the discount value.',
  isDiscountMore: 'Discount value cannot be more than price.',
  moreThan100: 'Cannot be more than 100%.',
  maxOccupancy: 'Value cannot be more than max occupancy.',
  notAllowedChr: 'Decimal are not allowed.',
  min: 'Value can not be less than 0.',
  moreThanTotal: 'Cannot be more than total',
};

export const noRecordAction = {
  actionName: '+Create New Service',
  imageSrc: 'assets/images/empty-table-service.png',
  description:
    'No services found. Tap the +Create Services to create & manage the services offered by your hotel',
};

export const noRecordActionForComp = {
  actionName: '+Import Services',
  imageSrc: 'assets/images/empty-table-service.png',
  description:
    'No services found. Tap the +Import Services to Import & manage the services offered by your hotel',
};

export const noRecordsActionForFeatures = {
  imageSrc: 'assets/images/empty-table-service.png',
  description: 'No services found.',
};
