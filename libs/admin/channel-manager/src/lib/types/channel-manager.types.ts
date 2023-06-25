export type RoomTypes = {
  label: string;
  value: string;
  ratePlans: {
    type: string;
    label: string;
    value: string;
    channels: {
      label: string;
      value: string;
    }[];
  }[];
};

export type DateOption = { day: string; date: number };
