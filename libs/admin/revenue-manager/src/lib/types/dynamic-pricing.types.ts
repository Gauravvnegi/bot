export type DynamicPricingRequest = {
  name: string;
  fromDate: number;
  toDate: number;
  daysIncluded: DaysType[];
  status: StatusType;
  configItems: ConfigItemType[];
};

export type DaysType =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SUNDAY';

export type ConfigCategory = 'ROOM_TYPE' | 'HOTEL';

export type ConfigItemType = {
  type: ConfigCategory;
  id: string;
  configRules: ConfigRuleType[];
};

export type ConfigRuleType = {
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

export type RevenueType = 'add' | 'update';
