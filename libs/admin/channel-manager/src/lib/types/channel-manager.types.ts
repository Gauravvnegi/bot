type Channel = {
  label: string;
  value: string;
};

export type RoomTypes = {
  label: string;
  value: string;
  channels: Channel[];
  ratePlans: {
    type: string;
    label: string;
    value: string;
    channels: Channel[];
  }[];
};

export type DateOption = { day: string; date: number };

export type RoomMapType = {
  availability: Map<
    number, // date
    { quantity: number; occupy: number }
  >;

  ratePlans: Map<
    string, //rate planId
    Map<
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
