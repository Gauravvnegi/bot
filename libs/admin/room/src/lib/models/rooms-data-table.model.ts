import { DateService } from '@hospitality-bot/shared/utils';
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
    this.records = input.rooms.map((item) => new Room().deserialize(item));
    this.count = new RoomRecordsCount().deserialize(input.roomStatusCount);

    return this;
  }
}

export class Room {
  id: string;
  type: string;
  roomNo: string;
  date: string;
  price: string;
  status: { label: string; value: string };
  deserialize(input: RoomResponse) {
    this.id = input.id;
    this.type = input.roomTypeDetails.name;
    this.roomNo = input.roomNumber;
    this.date = input.updated ?? input.created;
    this.price = `${input.currency} ${input.price}`;
    this.status = { label: Status[input.roomStatus], value: input.roomStatus };

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
  total: number;
  active: number;
  unavailable: number;
  soldOut: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'total', get(input, ['all']) ?? get(input, ['ALL'])),
      set({}, 'active', get(input, ['active']) ?? get(input, ['ACTIVE'])),
      set(
        {},
        'unavailable',
        get(input, ['unavailable']) ?? get(input, ['UNAVAILABLE'])
      ),
      set({}, 'soldOut', get(input, ['soldOut']) ?? get(input, ['SOLD_OUT']))
    );

    if (!this.total) delete this.total;
    return this;
  }
}

// ************ Room Type Models ******************

export class RoomTypeList {
  records: RoomType[];
  count: RoomTypeRecordsCount;

  deserialize(input: RoomTypeListResponse) {
    this.records = input.roomTypes.map((item) =>
      new RoomType().deserialize(item)
    );
    this.count = new RoomTypeRecordsCount().deserialize(
      input.roomTypeStatusCount
    );

    return this;
  }
}

export class RoomType {
  id: string;
  name: string;
  area: number;
  roomCount: RoomRecordsCount;
  amenities: string[];
  occupancy: number;
  status: { label: string; value: string };
  price: number;
  currency: string;

  deserialize(input: RoomTypeResponse) {
    this.id = input.id;
    this.name = input.name;
    this.area = input.area;
    this.roomCount = new RoomRecordsCount().deserialize(input.roomCount);
    this.amenities = input.paidAmenities
      .map((item) => item.name)
      .concat(input.complimentaryAmenities.map((item) => item.name));
    this.occupancy = input.maxOccupancy;
    this.status = {
      label: input.status ? Status.ACTIVE : Status.INACTIVE,
      value: input.status ? 'ACTIVE' : 'INACTIVE',
    };

    // mapping discounted price
    this.price = input.discountedPrice;
    this.currency = input.currency;

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
      set({}, 'total', get(input, ['all']) ?? get(input, ['ALL'])),
      set({}, 'active', get(input, ['active']) ?? get(input, ['ACTIVE'])),
      set({}, 'inactive', get(input, ['inactive']) ?? get(input, ['INACTIVE']))
    );
    return this;
  }
}
