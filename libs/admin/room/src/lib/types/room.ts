export type AddRoomTypes = 'single' | 'multiple';

export type QueryConfig = {
  params: string;
};

export type RoomTypeOption = {
  label: string;
  value: string;
  price: number;
  currency: string;
};

export type RatePlanOptions = {
  label: string;
  value: string;
}