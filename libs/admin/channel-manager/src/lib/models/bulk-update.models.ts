import { Option } from '@hospitality-bot/admin/shared';
import { Variant } from '../types/bulk-update.types';
import {
  PricingDetails,
  RoomType,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';

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
    const rooms = input
      .map((item) => new RoomTypes().deserialize(item, used))
      .filter((item) => item);
    return rooms;
  }
}

export class RoomTypes {
  id?: string;
  label: string;
  value: string;
  channels: Channel[];
  price: number;
  isBaseRoomType: boolean;
  roomCount: number;
  isBase: boolean;
  ratePlans: RatePlans[];
  maxOccupancy: number;
  pricingDetails: PricingDetails;
  deserialize(input: RoomType, used: UsedType) {
    const isChannelManager = used == 'channel-manager';
    const inputRatePlan = !isChannelManager
      ? input.ratePlans?.filter((ratePlan) => ratePlan.status)
      : input.ratePlans;
    this.label = input.name;
    this.value = input.id;
    this.id = input.id;
    this.channels = [];
    this.price = input.price;
    this.isBase = input.isBaseRoomType ?? false;
    this.roomCount = input.roomCount;
    this.maxOccupancy = input.occupancy;
    this.pricingDetails = input.pricingDetails;
    this.ratePlans =
      inputRatePlan.map((item) =>
        new RatePlans().deserialize(
          item,
          input.pricingDetails.base,
          input.occupancy,
          input.pricingDetails
        )
      ) ?? [];
    // Filter Room who have not any rate plan for channel-manager
    this.isBaseRoomType = input.isBaseRoomType ?? false;
    return isChannelManager && !this.ratePlans.length ? null : this;
  }
}

export class RatePlans {
  id: string;
  type: string;
  label: string;
  value: string;
  isBase: boolean;
  basePrice: number;
  variablePrice: number;
  maxOccupancy: number;
  pricingDetails: PricingDetails;
  channels: Channel[];
  deserialize(
    input,
    basePrice,
    maxOccupancy: number,
    pricingDetails: PricingDetails
  ) {
    this.type = input.label ?? '';
    this.label = input.label ?? '';
    this.value = input.id ?? '';
    this.id = input.id ?? '';
    this.isBase = input.isBase ?? false;
    this.basePrice = basePrice;
    this.maxOccupancy = maxOccupancy;
    this.variablePrice = input.variablePrice;
    this.pricingDetails = pricingDetails;
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
