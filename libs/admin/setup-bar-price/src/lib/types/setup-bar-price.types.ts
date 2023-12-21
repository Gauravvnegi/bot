export type BarPriceFormData = {
  roomTypeBar: PlanConfigForm[];
  ratePlanBar: PlanConfigForm[];
  roomOccupancyBar: PlanConfigForm[];
  extraBar: any;
};

export type BarPricePlanFormControl = keyof Omit<BarPriceFormData, 'extraBar'>;

export type PlanConfigForm = {
  plan: string;
  parentPlan: string;
  currency: string;
  modifierPrice: number;
  modifierLevel: number;
};

export type PlanOption = { label: string; value: string };

export type PlanItem = {
  label: string;
} & PlanConfigForm;

export type PlanItems = BaseOption<PlanItem>;
export type PlanOptions = BaseOption<PlanOption, { price: number }>;

type BaseOption<TOption, TBaseOption = {}> = [
  TOption & TBaseOption & { isBase: true },
  ...TOption[]
];

export type BarPricePlanConfiguration = Record<
  BarPricePlanFormControl,
  PlanItems
>;
