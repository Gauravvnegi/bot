export type DateOption = { day: string; date: number };

export type RoomMapType = {
  availability: Record<
    number, // date
    { quantity: number; occupy: number; dynamicPrice: boolean }
  >;

  ratePlans: Record<
    string, //rate planId
    Record<
      number, //date
      { date: number; available: number; pax?: Record<number, number> }
    > // date, qty
  >;
};

export type UpdateInventoryType = {
  startDate: number;
  endDate: number;
  rooms: {
    roomTypeId: string;
    available: number;
  }[];
};

export type UpdateRatesType = Omit<UpdateInventoryType, 'rooms'> & {
  rates: {
    pax: number;
    roomTypeId: string;
    rate: number;
    ratePlanId: string;
    ratePlanCode?: string;
    dynamicPricing: boolean;
  }[];
};

export type DynamicPricingType = Record<string, PriceInfo>;

export type PriceInfo = {
  price: number;
  pax: Record<number, number>;
};
