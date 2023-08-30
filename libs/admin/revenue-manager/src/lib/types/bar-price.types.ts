import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';

export type DateOption = { day: string; date: number };
export type UpdateBarPriceRequest = {
  inventoryList: BarPriceTypes[];
};

export type BarPriceTypes = {
  id: string;
  pricingDetails: PricingDetails;
  ratePlans: BarRatePlans[];
};

export type BarRatePlans = {
  id: string;
  variablePrice: number;
};

export type BarPriceFormType = {
  barPrices: BarPrice[];
  roomType: string[];
  roomTypes: LabelValue<string>[];
};

export type BarPrice = {
  adult: number;
  childBelowFive: number;
  chileFiveToTwelve: number;
  exceptions: any[];
  id: string;
  label: string;
  price: number;
  ratePlans: LabelValue<number>[];
};

type LabelValue<T> = {
  id?: string;
  label: string;
  value: T;
};
