export type RoomTypesResponse = {
  roomTypeId: string;
  available: number;
  roomCode: string;
};
type Availability = {
  available: number;
  occupancy: number;
};
export type UpdateInventoryResponse = {
  startDate: number;
  endDate: number;
  inventoryDataMap: Record<string, Availability>;
  rooms: RoomTypesResponse[];
};

export type ChannelManagerResponse = {
  roomCount: number;
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  roomTypes: UpdateInventoryResponse[] | UpdateRatesResponse[];
  soldOut: boolean;
};

export type Rates = {
  dynamicPricing: boolean;
  pax?: number;
  rate: number;
  ratePlanId: string;
  roomCode: string;
  roomTypeId: string;
};

export type UpdateRatesResponse = Omit<
  UpdateInventoryResponse,
  'inventoryData' | 'rooms'
> & {
  inventoryDataMap: Record<string, Availability>;
  rates: Rates[];
};
