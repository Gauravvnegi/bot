import { RoomType } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
export class Rooms {
  deserialize(input: RoomType[]) {
    return input
      .map((item) => new RoomTypes().deserialize(item))
      .filter((item) => item);
  }
}

export class RoomTypes {
  label: string;
  value: string;
  channels: Channel[];
  price: number;
  roomCount: number;
  isBase: boolean;
  ratePlans: RatePlans[];
  deserialize(input: RoomType) {
    this.label = input.name;
    this.value = input.id;
    this.channels = [];
    this.price = input.price;
    this.isBase = input.isBaseRoomType;
    this.roomCount = input.roomCount;
    this.ratePlans =
      input.ratePlans
        ?.filter((ratePlan) => ratePlan.status)
        .map((item) => new RatePlans().deserialize(item)) ?? [];
    return this;
  }
}

export class RatePlans {
  type: string;
  label: string;
  value: string;
  isBase: boolean;
  variablePrice: number;
  channels: Channel[];
  deserialize(input) {
    this.type = input.label ?? '';
    this.label = input.label ?? '';
    this.value = input.id ?? '';
    this.isBase = input.isBase ?? '';
    this.variablePrice = input.variablePrice;
    this.channels =
      input.channels?.map((item) => new Channel().deserialize(item)) ?? [];
    return this;
  }
}

export class Channel {
  label: string;
  value: string;
  deserialize(input) {
    this.label = input.label ?? '';
    this.value = input.value ?? '';
    return this;
  }
}
