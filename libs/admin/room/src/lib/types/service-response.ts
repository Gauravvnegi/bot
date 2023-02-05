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
  roomStatus: string;
  source: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type RoomListResponse = {
  records: RoomResponse[];
  counts: any;
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
  roomCount: number;
  maxChildren: number;
  maxAdult: number;
  area: string;
  status: boolean;
  totalOccupancy: number;
};

export type RoomTypeListResponse = {
  records: RoomTypeResponse[];
  counts: any;
};
