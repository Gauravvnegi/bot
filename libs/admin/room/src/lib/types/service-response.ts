export type RoomStatus = 'ACTIVE' | 'UNAVAILABLE' | 'SOLD_OUT' | 'INACTIVE';

export type RoomResponse = {
  id: string;
  roomNumber: string;
  floorNumber: string;
  roomTypeDetails: {
    id: string;
    name: string;
    roomCount: number;
    maxChildren: number;
    maxAdult: number;
    totalOccupancy: number;
  };
  roomStatus: RoomStatus;
  source: string;
  price: number;
  currency: string;
  created: string;
  updated: string;
};

export type RoomListResponse = {
  rooms: RoomResponse[];
  roomStatusCount: {
    ALL: number;
    ACTIVE: number;
    SOLD_OUT: number;
    UNAVAILABLE: number;
  };
};

export type RoomTypeResponse = {
  id: string;
  name: string;
  imageUrls: string[];
  complimentaryAmenities: [
    {
      id: string;
      name: string;
      description: string;
      rate: number;
      startDate: number;
      endDate: number;
      active: boolean;
      currency: string;
      packageCode: string;
      imageUrl: string;
      source: string;
      hotelId: string;
      type: string;
      unit: string;
      category: string;
      autoAccept: boolean;
      hasChild: boolean;
      parentId: string;
    }
  ];
  paidAmenities: [
    {
      id: string;
      name: string;
      description: string;
      rate: number;
      startDate: number;
      endDate: number;
      active: boolean;
      currency: string;
      packageCode: string;
      imageUrl: string;
      source: string;
      hotelId: string;
      type: string;
      unit: string;
      category: string;
      autoAccept: boolean;
      hasChild: boolean;
      parentId: string;
    }
  ];
  currency: string;
  originalPrice: number;
  discountedPrice: number;
  roomCount: {
    active: number;
    unavailable: number;
    soldOut: number;
  };
  maxChildren: number;
  maxAdult: number;
  area: string;
  status: boolean;
  totalOccupancy: number;
};

export type RoomTypeListResponse = {
  roomTypes: RoomTypeResponse[];
  roomTypeStatusCount: {
    ALL: number;
    ACTIVE: number;
    INACTIVE: number;
  };
};

export type AddRoomsResponse = {
  errorMessages: string[];
  rooms: RoomResponse[];
};
