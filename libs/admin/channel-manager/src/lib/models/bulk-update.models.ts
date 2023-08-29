import { Option } from '@hospitality-bot/admin/shared';
import { Variant } from '../types/bulk-update.types';
import { RoomType } from 'libs/admin/room/src/lib/models/rooms-data-table.model';

export function makeRoomOption(...data) {
  return data.map((item) => {
    return { label: item.label, value: item.value };
  }) as Option[];
}

export class CheckBoxTreeFactory {
  static buildTree(
    data,
    selectedRooms: string[],
    buildType: { isInventory: boolean }
  ) {
    let filteredData = data.filter((item) =>
      selectedRooms.includes(item.value)
    );

    filteredData = filteredData.length === 0 ? [...data] : [...filteredData];
    type ObjectType = typeof buildType.isInventory extends boolean
      ? Variant
      : RoomTypes;

    let tree: ObjectType[] = filteredData.map((item) => {
      let buildData = {
        id: item.value,
        name: item.label,
        isSelected: true,
        [buildType.isInventory ? 'channels' : 'variants']: [],
      };

      const getChannels = (parent) => {
        return parent['channels']?.map((item) => {
          return {
            id: item.value,
            name: item.label,
            isSelected: true,
          };
        });
      };

      if (buildType.isInventory) {
        buildData['channels'] = [...getChannels(item)];
      } else {
        for (let ratePlan of item['ratePlans']) {
          buildData['variants'].push({
            id: ratePlan.value,
            name: ratePlan.label,
            isSelected: true,
            channels: getChannels(ratePlan),
          });
        }
      }

      return buildData as ObjectType;
    }) as ObjectType[];
    return tree;
  }
}

export function getWeekendBG(day: string, isOccupancy = false) {
  return day === 'Sat' || day === 'Sun'
    ? isOccupancy
      ? 'weekend-occupancy-bg'
      : 'weekend-bg'
    : '';
}

export type UsedType = 'channel-manager' | 'revenue-manager';
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
    const isChannelManager = used == 'channel-manager';
    const inputRatePlan = !isChannelManager
      ? input.ratePlans?.filter((ratePlan) => ratePlan.status)
      : input.ratePlans;
    this.label = input.name;
    this.value = input.id;
    this.channels = [];
    this.price = input.price;
    this.isBase = input.isBaseRoomType;
    this.roomCount = input.roomCount;
    this.ratePlans =
      inputRatePlan.map((item) => new RatePlans().deserialize(item)) ?? [];
    // Filter Room who have not any rate plan for channel-manager
    return isChannelManager && !this.ratePlans.length ? null : this;
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
    this.isBase = input.isBase ?? false;
    this.variablePrice = input.variablePrice;
    this.channels = [];
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
