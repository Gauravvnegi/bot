export type RoomTypesResponse = {
  roomTypeId: string;
  available: number;
  roomCode: string;
};

export type UpdateInventoryResponse = {
  startDate: number;
  endDate: number;
  inventoryData: {
    available: number;
    occupancy: number;
  };
  rooms: RoomTypesResponse[];
};

export type ChannelManagerResponse = {
  roomCount: number;
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  updates: UpdateInventoryResponse[];
  soldOut: boolean;
};
