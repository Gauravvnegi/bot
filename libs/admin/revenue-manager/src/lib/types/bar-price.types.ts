type Channel = {
  label: string;
  value: string;
};

export type RoomTypes = {
  label: string;
  value: string;
  channels: Channel[];
  price: number;
  ratePlans: {
    type: string;
    label: string;
    value: string;
    isBase: boolean;
    variablePrice: number;
    channels: Channel[];
  }[];
};

export type DateOption = { day: string; date: number };
