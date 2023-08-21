import { FormArray } from '@angular/forms';

export type DynamicPricingResponse = {
  configDetails: DynamicPricingRequest[];
};

export type DynamicPricingRequest = {
  id?: string;
  name: string;
  fromDate: number;
  toDate: number;
  entityId?: string;
  daysIncluded: DaysType[];
  status: StatusType;
  type: ConfigType;
  configCategory: ConfigCategory;
  configItems: ConfigItemType[];
};

export type DaysType =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type ConfigCategory = 'ROOM_TYPE' | 'HOTEL';

export type ConfigItemType = {
  type: ConfigCategory;
  id: string;
  configRules: ConfigRuleType[];
};

export type ConfigRuleType = {
  id?: string;
  occupancyStart: number;
  occupancyEnd: number;
  discountOrMarkup: {
    type: string;
    value: number;
  };
  status: StatusType;
};

export type StatusType = 'ACTIVE' | 'INACTIVE';

export type ConfigType =
  | 'OCCUPANCY'
  | 'DATE_TIME_TRIGGER'
  | 'INVENTORY_REALLOCATION';

export type ModeType = 'add' | 'update';

export type OccupancyUpdateRequestType = Record<
  string,
  | string
  | number
  | DaysType[]
  | ConfigItemType[]
  | ConfigRuleType[]
  | ConfigCategory
>;

// occupancy types

export type OccupancyFormControlsType =
  | 'id'
  | 'fromDate'
  | 'toDate'
  | 'name'
  | 'configCategory'
  | 'roomType'
  | 'roomTypes'
  | 'selectedDays'
  | 'status'
  | 'removedRules'
  | 'hotelConfig';

export type RoomsConfigType = {
  isSelected: boolean;
  roomId: string;
  roomName: string;
  basePrice: number;
  occupancy: OccupancyRuleType[];
};

export type OccupancyRuleType = {
  id?: string;
  start: number;
  end: number;
  discount: number;
  rate?: number;
};

export type DynamicPricingForm = {
  occupancyFA: FormArray;
  inventoryAllocationFA: FormArray;
  timeFA: FormArray;
};
