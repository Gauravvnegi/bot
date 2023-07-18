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
  inventoryData: Availability;
  rooms: RoomTypesResponse[];
};

export type ChannelManagerResponse = {
  roomCount: number;
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  updates: UpdateInventoryResponse[] | UpdateRatesResponse[];
  soldOut: boolean;
};

type Rates = {
  dynamicPricing: boolean;
  rate: number;
  ratePlanId: string;
  roomCode: string;
  roomTypeId: string;
};

export type UpdateRatesResponse = Omit<
  UpdateInventoryResponse,
  'inventoryData' | 'rooms'
> & {
  inventoryDataMap: Map<string, Availability>;
  rates: Rates[];
};
