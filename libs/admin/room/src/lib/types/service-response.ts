export type RoomStatus =
  | 'CLEAN'
  | 'INSPECTED'
  | 'OUT_OF_SERVICE'
  | 'OUT_OF_ORDER'
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
  features: Features[];
  statusDetailsList: StatusDetails[];
  // status: RoomStatus;
  //--- can be modified
  // currentStatusFrom: number;
  // currentStatusTo: number;
  // remark: string;

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
  imageUrl: ImageUrl[];
  description: string;
  complimentaryAmenities: Amenity[];
  paidAmenities: Amenity[];
  roomCount: number;
  activeRoomCount: number;
  unavailableRoomCount: number;
  pricingDetails: PricingDetails;
  ratePlans: RatePlanRes[];
  soldOutCount: number;
  occupancyDetails: {
    maxChildren: number;
    maxAdult: number;
    maxOccupancy: number;
  };
  area: number;
  status: boolean;
  discountedPrice: number;
  originalPrice: number;
  currency: string;
  features: string[];
  isBaseRoomType?: boolean;
  shortDescription: string;
  rooms?: RoomResponse[];
};

export type RatePlanRes = {
  label?: string;
  type?: string;
  variablePrice: number;
  currency?: string;
  isBase: boolean;
  description?: string;
  discount?: {
    type: string;
    value: number;
  };
  id?: string;
  status?: boolean;
  sellingPrice?: number;
  total?: number;
};

export type PricingDetails = {
  base: number;
  basePrice: number;
  discountType?: string;
  discountValue?: number;
  bestAvailablePrice: number;
  currency: string;
  max: number;
  min: number;
  paxAdult: number;
  paxChild: number;
  paxChildAboveFive: number;
  paxChildBelowFive: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  discount: {
    type: string;
    value: number;
  };
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
  imageUrl;
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

export type Features = {
  id: string;
  name: string;
  imageUrl: string;
  created: number;
  updated: number;
};

export type RoomsByRoomType = {
  currentStatusFrom: number;
  currentStatusTo: number;
  floorNumber: string;
  frontOfficeState: string;
  id: string;
  nextStates: string[];
  remark: string;
  roomNumber: string;
  roomTypeDetails: {
    id: string;
    name: string;
  };
  status: string;
};

export type StatusDetails = {
  remarks?: string;
  status: RoomStatus;
  toDate?: number;
  fromDate?: number;
  isCurrentStatus?: boolean;
};

export type ImageUrl = {
  isFeatured: boolean;
  url: string;
};
