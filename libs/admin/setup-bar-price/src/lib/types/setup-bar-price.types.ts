export type BarPriceFromData = {
  roomTypeBar: PlanConfigForm;
  ratePlanBar: PlanConfigForm;
  roomOccupancyBar: PlanConfigForm;
  extrasBar: any;
};

export type PlanConfigForm = {
  plan: string;
  parentPlan: string;
  currency: string;
  modifierPrice: number;
  modifierLevel: number;
};
