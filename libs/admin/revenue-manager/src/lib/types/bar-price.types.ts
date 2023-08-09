type Channel = {
  label: string;
  value: string;
};

// refactor - Needs to converted to model - as it is not api response data
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
