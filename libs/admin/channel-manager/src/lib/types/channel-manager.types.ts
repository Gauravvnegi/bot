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
      { date: number; available: number }
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
    roomTypeId: string;
    rate: number;
    ratePlanId: string;
    dynamicPricing: boolean;
  }[];
};
