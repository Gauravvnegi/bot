import { NextStates } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { roomStatusDetails } from '../constant/response';
// import { Status } from '../constant/data-table';
import {
  AverageRoomRateResponse,
  InventoryCostRemainingResponse,
  InventoryRemainingResponse,
  OccupancyResponse,
  RoomListResponse,
  RoomResponse,
  RoomTypeListResponse,
  RoomTypeResponse,
} from '../types/service-response';

// ************ Room Models ******************

export class RoomList {
  records: Room[];
  count: RoomRecordsCount;
  typeCount: EntityTypeCount;
  deserialize(input: RoomListResponse) {
    this.records =
      input.rooms?.map((item) => new Room().deserialize(item)) ?? [];
    this.count = new RoomRecordsCount().deserialize(
      input.entityStateCounts,
      input.total
    );
    this.typeCount = new EntityTypeCount().deserialize(input.entityTypeCounts);

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
  nextStates: NextStates;

  deserialize(input: RoomResponse) {
    this.id = input.id ?? '';
    this.type = input.roomTypeDetails.name ?? '';
    this.roomNo = input.roomNumber ?? '';
    this.floorNo = input.floorNumber ?? '';
    this.date = input.updated ?? input.created ?? null;
    this.price = input.price ?? null;
    this.currency = input.currency ?? '';
    this.status = input.roomStatus ?? '';
    this.foStatus = input.foStatus ?? '';
    //  --refactor-- this logic need to be moved to toggle button - refer table logic (same)
    this.nextStates = [...input.nextStates, input.roomStatus].map((item) => ({
      label: roomStatusDetails[item]?.label ?? item,
      value: item,
      type: roomStatusDetails[item]?.type ?? 'active',
    }));
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

export class RoomRecordsCount {
  ALL: number;
  CLEAN: number;
  INSPECTED: number;
  OUT_OF_SERVICE: number;
  OUT_OF_ORDER: number;
  UNAVAILABLE: number;

  deserialize(input: RoomListResponse['entityStateCounts'], total: number) {
    this.ALL = total;
    this.UNAVAILABLE = input.UNAVAILABLE ?? 0;
    this.CLEAN = input.UNAVAILABLE ?? 0;
    this.INSPECTED = input.INSPECTED ?? 0;
    this.OUT_OF_SERVICE = input.OUT_OF_SERVICE ?? 0;
    this.OUT_OF_ORDER = input.OUT_OF_ORDER ?? 0;
    this.UNAVAILABLE = input.UNAVAILABLE ?? 0;

    return this;
  }
}

// ************ Room Type Models ******************

export class RoomTypeList {
  records: RoomType[];
  count: RoomTypeRecordCounts;
  typeCount: EntityTypeCount;

  deserialize(input: RoomTypeListResponse) {
    this.records =
      input?.roomTypes.map((item) => new RoomType().deserialize(item)) ?? [];
    this.count = new RoomTypeRecordCounts().deserialize(
      input.entityStateCounts
    );
    this.typeCount = new EntityTypeCount().deserialize(input.entityTypeCounts);

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
  status: 'ACTIVE' | 'UNAVAILABLE';
  price: number;
  currency: string;
  nextStates: NextStates;

  deserialize(input: RoomTypeResponse) {
    this.id = input.id ?? '';
    this.name = input.name ?? '';
    this.area = input.area;
    this.roomCount = input.roomCount;
    this.amenities =
      input.paidAmenities
        ?.map((item) => item.name)
        .concat(input.complimentaryAmenities.map((item) => item.name)) ?? [];
    this.occupancy = input.maxOccupancy ?? null;
    this.status = input.status ? 'ACTIVE' : 'UNAVAILABLE';
    // mapping discounted price
    this.price = input.discountedPrice ?? input.originalPrice;
    this.currency = input.currency ?? '';
    this.nextStates = [
      {
        label: 'Active',
        value: 'ACTIVE',
        type: 'active',
      },
      {
        label: 'Unavailable',
        value: 'UNAVAILABLE',
        type: 'failed',
      },
    ];

    return this;
  }
}

export class RoomTypeRecordCounts {
  ALL: number;
  ACTIVE: number;
  UNAVAILABLE: number;
  deserialize(input: RoomTypeListResponse['entityStateCounts']) {
    this.ALL = Number(Object.values(input).reduce((a, b) => a + b, 0));
    this.UNAVAILABLE = input.INACTIVE;
    this.ACTIVE = input.ACTIVE;
    return this;
  }
}
export class EntityTypeCount {
  ROOM_TYPE: number;
  ROOM: number;
  deserialize(input: RoomTypeListResponse['entityTypeCounts']) {
    this.ROOM_TYPE = input.ROOM_TYPE;
    this.ROOM = input.ROOM;
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
