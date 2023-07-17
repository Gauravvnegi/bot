import { Option } from '@hospitality-bot/admin/shared';
import {
  BulkUpdateForm,
  BulkUpdateRequest,
  RoomTypes,
  Variant,
} from '../types/bulk-update.types';
import { ChannelManagerResponse } from '../types/response.type';
export class FormFactory {
  static makeRatesRequestData(formData: BulkUpdateForm) {
    let modifiedData: BulkUpdateRequest[] = [];
    return modifiedData;
  }
}

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
        isSelected: false,
        [buildType.isInventory ? 'channels' : 'variants']: [],
      };

      const getChannels = (parent) => {
        return parent['channels']?.map((item) => {
          return {
            id: item.value,
            name: item.label,
            isSelected: false,
          };
        });
      };

      if (buildType.isInventory) {
        buildData['channels'] = [...getChannels(item)];
      } else {
        for (let ratePlan of item['ratePlans']) {
          buildData['variants'].push({
            id: ratePlan.value,
            name: ratePlan.type + ` ( ${ratePlan.label} )`,
            isSelected: false,
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

export class UpdateInventory {
  perDayRoomAvailability = new Map<
    number,
    {
      roomAvailable: number;
      occupancy: number;
    }
  >();

  inventoryRoomDetails = new Map<
    string,
    {
      roomId: string;
      roomCode: string;
      availableRoom: number;
    }[]
  >();

  deserialize(input: ChannelManagerResponse) {
    input.updates?.forEach((item) => {
      item.rooms?.forEach((inventory) => {
        if (!this.inventoryRoomDetails[inventory.roomTypeId]) {
          this.inventoryRoomDetails[inventory.roomTypeId] = [];
        }

        this.inventoryRoomDetails[inventory.roomTypeId] = [
          ...this.inventoryRoomDetails[inventory.roomTypeId],
          {
            date: item.startDate ?? item.endDate,
            roomId: inventory.roomTypeId,
            roomCode: inventory.roomCode,
            availableRoom: inventory.available,
          },
        ];
      });

      this.perDayRoomAvailability[item.startDate] = {
        roomAvailable: item.inventoryData.available,
        occupancy: item.inventoryData.occupancy,
      };
    });
    return this;
  }

  static buildRequestData(formData, fromDate: number) {
    let updates: {
      startDate: number;
      endDate: number;
      rooms: {
        roomTypeId: string;
        available: number;
      }[];
    }[] = [];
    formData.roomTypes.forEach((item, index) => {
      let currentDate = new Date(fromDate);
      updates =
        item.availability.map((available, dayIndex) => {
          var roomData = {
            roomTypeId: item.value,
            available: available.value ? +available.value : null,
          };
          var rooms = {
            startDate: currentDate.getTime(),
            endDate: currentDate.getTime(),
            rooms: !updates.length
              ? [{ ...roomData }]
              : updates[dayIndex]?.rooms?.length
              ? [...updates[dayIndex]?.rooms, { ...roomData }]
              : [{ ...roomData }],
          };

          rooms.rooms =
            rooms.rooms.filter((filterItem) => filterItem.available) ?? [];

          currentDate.setDate(currentDate.getDate() + 1);
          return rooms.rooms.length > 0 && rooms;
        }) ?? [];
    });
    return updates.filter((item) => item) ?? [];
  }
}
