import { Option } from '@hospitality-bot/admin/shared';
import {
  BulkUpdateForm,
  BulkUpdateRequest,
  RoomTypes,
  Variant,
} from '../types/bulk-update.types';

export function makeRoomOption(...data) {
  return data.map((item) => {
    return { label: item.label, value: item.value };
  }) as Option[];
}

export function makeRoomsData(rooms) {
  let res = rooms.map((item) => {
    let room = {
      label: item.name,
      value: item.id,
      channels: [],
      ratePlans:
        item.ratePlans
          .map((ratePlan) =>
            ratePlan.status
              ? {
                  type: ratePlan.label,
                  label: ratePlan.label,
                  value: ratePlan.id,
                  channels: [],
                }
              : null
          )
          ?.filter((ratePlan) => ratePlan) ?? [],
    };
    return room.ratePlans.length ? room : null;
  });

  // TODO: It must at least 1 ratePlans
  return res.filter((item) => item);
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
