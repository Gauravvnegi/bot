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
