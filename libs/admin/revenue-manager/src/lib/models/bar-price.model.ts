import { RoomType } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
type UsedType = 'channel-manager' | 'revenue-manager';
export class Rooms {
  deserialize(input: RoomType[], used?: UsedType) {
    return input
      .map((item) => new RoomTypes().deserialize(item, used))
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
  deserialize(input: RoomType, used: UsedType) {
    this.label = input.name;
    this.value = input.id;
    this.channels = [];
    this.price = input.price;
    this.isBase = input.isBase;
    this.roomCount = input.roomCount;
    this.ratePlans =
      input.ratePlans
        ?.filter((ratePlan) => ratePlan.status)
        .map((item) => new RatePlans().deserialize(item)) ?? [];

    // Filter Room who have not any rate plan for channel-manager
    return used == 'channel-manager' && !this.ratePlans.length ? null : this;
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
