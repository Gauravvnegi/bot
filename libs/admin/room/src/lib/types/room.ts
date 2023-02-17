export type TableValue = 'room' | 'roomType';

export type AddRoomTypes = 'single' | 'multiple';

export type QueryConfig = {
  params: string;
};

export type RoomTypeOption = {
  id: string;
  label: string;
  price: number;
  currency: string;
};
