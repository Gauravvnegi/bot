import { EntityState } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
// import { Status } from '../constant/data-table';
import {
  AverageRoomRateResponse,
  Features,
  InventoryCostRemainingResponse,
  InventoryRemainingResponse,
  OccupancyResponse,
  RatePlanRes,
  RoomListResponse,
  RoomResponse,
  RoomTypeListResponse,
  RoomTypeResponse,
  StatusDetails,
} from '../types/service-response';

// ************ Room Models ******************

export class RoomList {
  records: Room[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: RoomListResponse) {
    this.records =
      input.rooms?.map((item) => new Room().deserialize(item)) ?? [];
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.totalRecord = input.total;

    return this;
  }
}

export class Room {
  id: string;
  type: string;
  roomNo: string;
  floorNo: string;
  date: number;
  price: number;
  currency: string;
  status: string;
  foStatus: string;
  nextStates: string[];
  features: Features[];
  statusDetailsList?: StatusDetails[];

  deserialize(input: RoomResponse) {
    this.id = input.id ?? '';
    this.type = input.roomTypeDetails.name ?? '';
    this.roomNo = input.roomNumber ?? '';
    this.floorNo = input.floorNumber ?? '';
    this.date = input.updated ?? input.created ?? null;
    this.price = input.price ?? null;
    this.currency = input.currency ?? '';

    const currentStatus = input.statusDetailsList.filter(
      (item) => item.isCurrentStatus
    )[0]?.status;

    this.status = currentStatus;
    this.foStatus = input.frontOfficeState ?? '';
    this.nextStates = [...input.nextStates, currentStatus];
    this.features = input.features ?? [];
    this.statusDetailsList = input.statusDetailsList;
    return this;
  }

  /**
   * Return the formatted date
   */
  getFormattedDate(timezone = '+05:30', format = 'DD/MM/YY, h:mm a') {
    return DateService.getDateFromTimeStamp(
      this.date,
      format,
      timezone
    ).replace(',', ' at');
  }
}

// ************ Room Type Models ******************

export class RoomTypeList {
  records: RoomType[];
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: RoomTypeListResponse) {
    this.records =
      input?.roomTypes.map((item) => new RoomType().deserialize(item)) ?? [];
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.totalRecord = input.total;

    this.records.sort((a, b) => {
      // Sort by isBaseRoomType in descending order (true comes first)
      if (a.isBaseRoomType && !b.isBaseRoomType) {
        return -1;
      } else if (!a.isBaseRoomType && b.isBaseRoomType) {
        return 1;
      } else {
        return 0;
      }
    });
    return this;
  }
}

export class RoomType {
  id: string;
  name: string;
  area: number;
  roomCount: number;
  amenities: string[];
  occupancy: number;
  status: boolean;
  price: number;
  currency: string;
  isBaseRoomType: boolean;
  nextStates: string[];
  ratePlans?: RatePlanRes[];
  pricingDetails?: PricingDetails;
  maxAdult?: number;

  deserialize(input: RoomTypeResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.area = input.area;
    this.roomCount = input.roomCount;
    this.amenities =
      input.paidAmenities
        ?.map((item) => item.name)
        .concat(input.complimentaryAmenities.map((item) => item.name)) ?? [];
    this.occupancy = input.occupancyDetails.maxOccupancy ?? 0;
    this.status = input.status;
    // mapping discounted price
    this.price =
      input.discountedPrice ??
      input.originalPrice ??
      input.pricingDetails?.base;
    this.currency = input.currency ?? '';
    this.ratePlans = input?.ratePlans?.map((item) => ({
      ...item,
      basePrice: input?.pricingDetails?.base ?? 0,
    })) ?? [];
    this.maxAdult = input?.occupancyDetails?.maxAdult ?? 0;
    this.isBaseRoomType = input.isBaseRoomType ?? false;
    this.pricingDetails = new PricingDetails().deserialize(input);
    return this;
  }
}

export class PricingDetails {
  base: number;
  paxAdult: number;
  paxChildAboveFive: number;
  paxChildBelowFive: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  deserialize(input: RoomTypeResponse): PricingDetails {
    const { pricingDetails } = input;
    Object.assign(this, pricingDetails);
    return this;
  }
}

export class RoomStatGraph {
  label: string;
  comparisonPercent: number;
  additionalData: string;
  graph: any;

  deserialize(input: AverageRoomRateResponse) {
    this.label = input.label.replace(/\s+/g, '');
    this.additionalData = shortenNumber(input.score);
    this.comparisonPercent = input.comparisonPercent;
    this.graph = input.averageRoomRateGraph;
    return this;
  }
}
export class OccupancyGraph {
  label: string;
  comparisonPercent: number;
  additionalData: string;
  graph: any;

  deserialize(input: OccupancyResponse) {
    this.label = input.label.replace(/\s+/g, '');
    this.additionalData = `${input.score}%`;
    this.comparisonPercent = input.comparisonPercent;
    this.graph = input.occupancyGraph;
    return this;
  }
}

export class RemainingInventory {
  label: string;
  occupied?: number;
  remaining?: number;
  additionalData: string;

  deserialize(input: InventoryRemainingResponse) {
    this.label = input.label.replace(/\s+/g, '');
    this.occupied = input.occupied;
    this.remaining = input.remaining;
    this.additionalData = `${input.remaining} Rooms`;
    return this;
  }
}

export class RemainingInventoryCost {
  label: string;
  spent?: number;
  remaining?: number;
  additionalData: string;

  deserialize(input: InventoryCostRemainingResponse) {
    this.label = input.label.replace(/\s+/g, '');
    this.spent = input.spent;
    this.remaining = input.remaining;
    this.additionalData = shortenNumber(input.remaining);
    return this;
  }
}

//--- move to utils -----
function shortenNumber(value: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const suffixNum = Math.floor(('' + value).length / 3);
  let shortValue = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toFixed(2)
  );
  if (shortValue % 1 !== 0) {
    shortValue = parseFloat(shortValue.toFixed(2));
  }
  return shortValue + suffixes[suffixNum];
}
