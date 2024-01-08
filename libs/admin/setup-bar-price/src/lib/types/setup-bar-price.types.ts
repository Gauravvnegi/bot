import { FormGroup } from '@angular/forms';
import { FormGroupControls } from '@hospitality-bot/admin/shared';
import { LevelType } from '../constants/setup-bar-price.const';

export type BarPriceFormData = {
  roomTypeBar: PlanConfigForm[];
  ratePlanBar: PlanConfigForm[];
  roomOccupancyBar: PlanConfigForm[];
  extraBar: ExtraPlanConfigFormData;
};

export type ExtraBarPriceFormControlName = keyof Pick<
  BarPriceFormData,
  'extraBar'
>;

export type BarPricePlanFormControlName = keyof Omit<
  BarPriceFormData,
  ExtraBarPriceFormControlName
>;

export type PlanConfigForm = {
  name: string;
  plan: string;
  parentPlan: string;
  currency: string;
  modifierPrice: number;
  modifierLevel: number;
};

export type ExtraPriceFormData = {
  name: string;
  plan: string;
  price: number;
};

export type ExtraPlanConfigFormData = {
  level: LevelType;
  hotelTypeConfig: ExtraPriceFormData[];
  roomTypeConfig: {
    roomType: string;
    roomTypeName: string;
    extraPrice: ExtraPriceFormData[];
  }[];
};

export type PlanOption = { label: string; value: string };

export type PlanItems = BaseOption<PlanConfigForm>;
export type PlanOptions = BaseOption<PlanOption, { price: number }>;

type BaseOption<TOption, TBaseOption = {}> = [
  TOption & TBaseOption & { isBase: true },
  ...TOption[]
];

export type BarPricePlanConfiguration = Record<
  BarPricePlanFormControlName,
  PlanItems
> &
  Record<ExtraBarPriceFormControlName, ExtraPlanConfigFormData>;

export type PlanConfigFormGroup = FormGroupControls<PlanConfigForm>;
export type ExtraPlanFormGroup = FormGroupControls<ExtraPlanConfigFormData>;
