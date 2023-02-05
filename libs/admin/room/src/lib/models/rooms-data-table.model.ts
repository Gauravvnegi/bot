import { get, set } from 'lodash';
import { Status } from '../constant/data-table';
import {
  RoomListResponse,
  RoomResponse,
  RoomTypeListResponse,
  RoomTypeResponse,
} from '../types/service-response';

// ************ Room Models ******************
export class RoomList {
  records: Room[];
  count: RoomRecordsCount;
  deserialize(input: RoomListResponse) {
    this.records = input.records.map((item) => new Room().deserialize(item));
    this.count = new RoomRecordsCount().deserialize(input.counts);

    return this;
  }
}

export class Room {
  id: string;
  type: string;
  roomNo: string;
  date: string;
  price: number;
  status: { label: string; value: string };
  deserialize(input: RoomResponse) {
    let status = input.roomStatus.toLowerCase();

    this.id = input.id;
    this.type = input.roomTypeDetails.name;
    this.roomNo = input.roomNumber;
    this.date = input.updatedAt;
    this.price = input.price;
    this.status = { label: Status[status], value: status };

    return this;
  }
}

export class RoomRecordsCount {
  total: number;
  active: number;
  unavailable: number;
  soldOut: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'total', get(input, ['total'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'unavailable', get(input, ['unavailable'])),
      set({}, 'soldOut', get(input, ['soldOut']))
    );

    return this;
  }
}

// ************ Room Type Models ******************

export class RoomTypeList {
  records: RoomType[];
  count: RoomTypeRecordsCount;

  deserialize(input: RoomTypeListResponse) {
    this.records = input.records.map((item) =>
      new RoomType().deserialize(item)
    );
    this.count = new RoomTypeRecordsCount().deserialize(input.counts);

    return this;
  }
}

export class RoomType {
  id: string;
  name: string;
  area: string;
  roomCount: number;
  amenities: string[];
  occupancy: number;
  status: { label: string; value: string };

  deserialize(input: RoomTypeResponse) {
    this.id = input.id;
    this.name = input.name;
    this.area = input.area;
    this.roomCount = input.roomCount;
    this.amenities = input.paidAmenities
      .map((item) => item.name)
      .concat(input.complimentaryAmenities.map((item) => item.name));
    this.occupancy = input.totalOccupancy;
    this.status = {
      label: input.status ? Status.active : Status.inactive,
      value: input.status ? 'active' : 'inactive',
    };

    return this;
  }
}

export class RoomTypeRecordsCount {
  total: number;
  active: number;
  inactive: number;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'total', get(input, ['total'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'inactive', get(input, ['inactive']))
    );

    return this;
  }
}
