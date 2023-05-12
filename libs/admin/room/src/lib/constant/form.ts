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
  originalPrice: number;
  discountType: string;
  discountValue: number;
  discountedPrice: number;
  variablePriceCurrency: string;
  currency: string;
  variableAmount: number;
  discountedPriceCurrency: string;
  maxOccupancy: number;
  maxChildren: number;
  maxAdult: number;
  area: number;
};

export type RoomTypeData = Omit<
  RoomTypeFormData,
  | 'complimentaryAmenities'
  | 'paidAmenities'
  | 'variablePriceCurrency'
  | 'discountedPriceCurrency'
> & {
  roomAmenityIds: string[];
  status: boolean;
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
  link: '/pages/library/services/create-service',
  imageSrc: 'assets/images/empty-table-service.png',
  description:
    'No services found. Tap the +Create Services to create & manage the services offered by your hotel',
};
