import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';

export type DateOption = { day: string; date: number };
export type UpdateBarPriceRequest = {
  inventoryList: BarPriceTypes[];
};

export type BarPriceTypes = {
  id: string;
  isBaseRoomType: boolean;
  pricingDetails: PricingDetails;
  ratePlans: BarRatePlans[];
};

export type BarRatePlans = {
  id: string;
  variablePrice: number;
  isBase?: boolean;
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
  baseId: string;
  isBase: boolean;
  variablePrice: number;
  ratePlans: LabelValue<number>[];
};

type LabelValue<T> = {
  id?: string;
  label: string;
  value: T;
};
