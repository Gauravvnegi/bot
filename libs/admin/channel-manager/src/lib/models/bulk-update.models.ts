import { Option } from '@hospitality-bot/admin/shared';
import {
  BulkUpdateForm,
  BulkUpdateRequest,
  Channel,
  RoomTypes,
  Variant,
} from '../types/bulk-update.types';
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
