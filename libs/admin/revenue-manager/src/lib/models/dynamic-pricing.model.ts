import { FormArray, FormGroup } from '@angular/forms';
import {
  ConfigItemType,
  ConfigRuleType,
  ConfigType,
  DaysType,
  DynamicPricingRequest,
  OccupancyFormControlsType,
  OccupancyUpdateRequestType,
  ModeType,
  DynamicPricingResponse,
  ConfigCategory,
  RoomsConfigType,
} from '../types/dynamic-pricing.types';
import { RoomTypes } from '../types/bar-price.types';
import { OccupancyComponent } from '../components/occupancy/occupancy.component';
export class DynamicPricingFactory {
  static buildRequest(form: FormGroup, type: ConfigType, mode: ModeType) {
    let data:
      | DynamicPricingRequest
      | OccupancyUpdateRequestType
      | Record<string, string>;
    switch (type) {
      case 'OCCUPANCY':
        data =
          mode === 'add'
            ? DynamicPricingFactory.getNewProperties(form)
            : DynamicPricingFactory.getChangedProperties(form);
        break;
      case 'DATE_TIME_TRIGGER':
        // add method for date time trigger
        break;
      case 'INVENTORY_REALLOCATION':
        // add method for date time INVENTORY REALLOCATION
        break;
    }

    return data;
  }
  static getNewProperties(form: FormGroup) {
    const {
      fromDate,
      toDate,
      name,
      configCategory,
      roomTypes,
      selectedDays,
      status,
    } = form.controls;
    return {
      status: status.value ? 'ACTIVE' : 'INACTIVE',
      name: name.value,
      fromDate: new Date(fromDate.value).getTime(),
      toDate: new Date(toDate.value).getTime(),
      daysIncluded: selectedDays.value.map((day: string) => day.toUpperCase()),
      configItems: (roomTypes as FormArray).controls
        .filter((item) => item.get('isSelected').value)
        .map((room: FormGroup) => {
          const { occupancy, roomId } = room.controls;
          const configItem: ConfigItemType = {
            type: configCategory.value,
            id: roomId.value,
            configRules: (occupancy as FormArray).controls.map(
              (rule: FormGroup) => DynamicPricingFactory.getOccupancyRules(rule)
            ),
          };
          return configItem;
        }),
    } as DynamicPricingRequest;
  }

  static getChangedProperties(formGroup: FormGroup) {
    let requestData: OccupancyUpdateRequestType = {};
    Object.keys(formGroup.controls).forEach(
      (name: OccupancyFormControlsType) => {
        const currentControl = formGroup.controls[name];
        if (currentControl.dirty) {
          if (name == 'roomTypes') {
            let occupancyRuleData: ConfigRuleType[] = [];
            (currentControl as FormArray).controls
              .filter(
                (roomType: FormGroup) =>
                  roomType.get('isSelected').value && roomType.dirty
              )
              .forEach((roomType: FormGroup) =>
                (roomType.get(
                  'occupancy'
                ) as FormArray).controls.forEach((occupancyRule: FormGroup) =>
                  occupancyRuleData.push(
                    DynamicPricingFactory.getOccupancyRules(occupancyRule)
                  )
                )
              );
            requestData[name] = occupancyRuleData;
          } else if (name === 'removedRules') {
            currentControl['controls'].length &&
              (requestData[name] = currentControl['controls']);
          } else {
            const dependentControlList: OccupancyFormControlsType[] = [
              'fromDate',
              'toDate',
              'selectedDays',
            ];
            if (dependentControlList.includes(name)) {
              dependentControlList.forEach((item) => {
                requestData[item] = formGroup.get(item).value;
              });
            }
            requestData[name] = currentControl.value;
          }
        }
      }
    );
    return requestData;
  }

  static getOccupancyRules(rule: FormGroup): ConfigRuleType {
    const { id, discount, end, rate, start } = rule.controls;
    const status = true; //TODO, Future dependent
    return {
      id: id?.value ?? undefined,
      occupancyStart: +start?.value,
      occupancyEnd: +end?.value,
      status: status ? 'ACTIVE' : 'INACTIVE',
      discountOrMarkup: {
        type: 'PERCENTAGE',
        value: +discount?.value,
      },
    };
  }
}

export class DynamicPricingHandler {
  dataList: DynamicPricingForm[];
  deserialize(input: DynamicPricingResponse, rooms: RoomTypes[]) {
    this.dataList =
      input.configDetails?.map((item) =>
        new DynamicPricingForm().deserialize(item, rooms)
      ) ?? [];
    return this;
  }

  mapOccupancy(season: FormGroup, item: DynamicPricingForm) {
    season.patchValue({
      id: item.id,
      fromDate: item.fromDate,
      toDate: item.toDate,
      type: 'update',
      name: item.name,
      configCategory: item.configCategory,
      selectedDays: item.selectedDays,
      status: item.status,
      roomType: item.roomType,
    });

    const roomTypesControl = season.get('roomTypes') as FormArray;
    const roomTypesControlList = roomTypesControl.controls.filter(
      (control: FormGroup) =>
        season.get('roomType').value.includes(control.get('roomId').value)
    );

    roomTypesControlList.forEach((roomType: FormGroup, roomIndex) => {
      const { occupancy } = roomType.controls;
      (occupancy as FormArray).controls.forEach(
        (occupancyControl: FormGroup, occupancyIndex) => {
          const rule = item.roomTypes[roomIndex]?.occupancy[occupancyIndex];
          rule &&
            occupancyControl.patchValue({
              id: rule.id,
              start: rule.start,
              end: rule.end,
              discount: rule.discount,
            });
        }
      );
    });
  }
}

export class DynamicPricingForm {
  status: boolean;
  id?: string;
  type: ModeType;
  name: string;
  fromDate: number;
  toDate: number;
  configCategory: ConfigCategory;
  roomType: string[];
  selectedDays: string[];
  roomTypes: RoomsConfigType[];
  deserialize(input: DynamicPricingRequest, rooms: RoomTypes[]) {
    this.status = input?.status == 'ACTIVE' ? true : false;
    this.id = input.id;
    this.type = 'update';
    this.name = input.name;
    this.fromDate = input.fromDate;
    this.toDate = input.toDate;
    this.configCategory = input.configCategory;
    this.selectedDays = input.daysIncluded;
    this.roomType = input.configItems.map((item) => item.id);
    this.roomTypes = input.configItems.map((room, index) => {
      const currentRoom = rooms.find((item) => item.value == room.id);
      let roomConfig: RoomsConfigType = {
        isSelected: false,
        roomId: room.id,
        basePrice: currentRoom?.price,
        roomName: currentRoom?.label,
        occupancy: room.configRules.map((rule) => ({
          id: rule?.id,
          start: rule.occupancyStart,
          end: rule.occupancyEnd,
          discount: rule.discountOrMarkup.value,
        })),
      };
      return roomConfig;
    });
    return this;
  }
}
