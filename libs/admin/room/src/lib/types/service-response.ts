import { StaticPricingMod } from '../constant/form';

export type RoomStatus =
  | 'CLEAN'
  | 'INSPECTED'
  | 'OUT_OF_SERVICE'
  | 'OUT_OF_ORDER'
  | 'UNAVAILABLE'
  | 'DIRTY';

export type RoomTypeStatus = 'ACTIVE' | 'INACTIVE';

export type RoomFoStatus = 'VACANT' | 'OCCUPIED';

export type RoomResponse = {
  id: string;
  roomNumber: string;
  floorNumber: string;
  nextStates: RoomStatus[];
  frontOfficeState: RoomFoStatus;
  roomTypeDetails: {
    id: string;
    name: string;
    roomCount: number;
    maxChildren: number;
    maxAdult: number;
    totalOccupancy?: number;
    activeRoomCount: number;
    soldOutCount: number;
    soldOut: boolean;
    unavailableRoomCount: number;
  };
  features: any[];
  roomStatus: RoomStatus;
  //--- can be modified
  toDate: number;
  fromDate: number;
  remarks: string;

  source?: string;
  price: number;
  currency: string;
  created: number;
  updated: number;
};

export type RoomByIdResponse = {
  rooms: RoomResponse[];
  roomCount: number;
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  soldOut: boolean;
};

export type RoomListResponse = {
  rooms: RoomResponse[];
  entityTypeCounts: {
    ROOM_TYPE: number;
    ROOM: number;
  };
  entityStateCounts: Record<RoomStatus | RoomFoStatus, number>;
  total: number;
};

export type RoomTypeResponse = {
  id: string;
  name: string;
  imageUrls: string[];
  description: string;
  complimentaryAmenities: Amenity[];
  paidAmenities: Amenity[];
  roomCount: number;
  activeRoomCount: number;
  unavailableRoomCount: number;
  ratePlans: StaticPricingMod[];
  soldOutCount: number;
  maxChildren: number;
  maxAdult: number;
  area: number;
  status: boolean;
  maxOccupancy: number;
  discountedPrice: number;
  originalPrice: number;
  currency: string;
  features: string[];
};

export type RoomTypeListResponse = {
  roomTypes: RoomTypeResponse[];
  entityTypeCounts: {
    ROOM_TYPE: number;
    ROOM: number;
  };
  entityStateCounts: {
    ACTIVE: number;
    INACTIVE: number;
  };
  total: number;
};

export type AddRoomsResponse = {
  errorMessages: string[];
  rooms: RoomResponse[];
};

export type AmenityResponse = {
  total: number;
  entityTypeCounts: number;
  entityStateCounts: number;
  records: Amenity[];
  entityTypeLabels: string[];
  entityStateLabels: string[];
  entityCategory: string;
};

export type ServiceResponse = {
  paidPackages: Amenity[];
  complimentaryPackages: Amenity[];
};

export type Amenity = {
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
  entityId: string;
  type: string;
  unit: string;
  category: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
};

export interface AverageRoomRateResponse {
  label: string;
  score: number;
  comparisonPercent: number;
  averageRoomRateGraph: any;
}

export interface OccupancyResponse {
  label: string;
  score: number;
  comparisonPercent: number;
  occupancyGraph: any;
}

export interface InventoryRemainingResponse {
  label: string;
  occupied: number;
  remaining: number;
}

export interface InventoryCostRemainingResponse {
  label: string;
  spent: number;
  remaining: number;
}

export type GraphData = {
  label: string;
  value: number;
};

export type RatePlanResponse = {
  id: string;
  label: string;
  key: string;
  isDefault: boolean;
};
