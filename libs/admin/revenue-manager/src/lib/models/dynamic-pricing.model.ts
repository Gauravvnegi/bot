import { FormArray, FormGroup } from '@angular/forms';
import {
  ConfigItemType,
  ConfigRuleType,
  ConfigType,
  DynamicPricingRequest,
  OccupancyFormControlsType,
  ModeType,
  DynamicPricingResponse,
  ConfigCategory,
  RoomsConfigType,
  OccupancyRuleType,
  DynamicPricingUpdateRequestType,
} from '../types/dynamic-pricing.types';
import { OccupancyComponent } from '../components/occupancy/occupancy.component';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { DayTimeTriggerComponent } from '../components/day-time-trigger/day-time-trigger.component';
import { Revenue } from '../constants/revenue-manager.const';
export class DynamicPricingFactory {
  static buildRequest(form: FormGroup, type: ConfigType, mode: ModeType) {
    let data:
      | DynamicPricingRequest
      | DynamicPricingUpdateRequestType
      | Record<string, string>;
    data =
      mode === 'add'
        ? DynamicPricingFactory.getNewProperties(form, type)
        : DynamicPricingFactory.getChangedProperties(form, type);
    return data;
  }
  static getNewProperties(form: FormGroup, type: ConfigType) {
    const {
      fromDate,
      toDate,
      name,
      configCategory,
      roomTypes,
      selectedDays,
      status,
      hotelConfig,
      hotelId,
    } = form.controls;

    const isHotelType = configCategory.value === 'HOTEL';
    return {
      status: status.value ? 'ACTIVE' : 'INACTIVE',
      name: name.value,
      fromDate: new Date(fromDate.value).getTime(),
      toDate: new Date(toDate.value).getTime(),
      daysIncluded: selectedDays.value.map((day: string) => day.toUpperCase()),

      configItems: isHotelType
        ? [
            {
              type: configCategory.value,
              id: hotelId.value ?? undefined,
              configRules: (hotelConfig as FormArray).controls.map(
                (rule: FormGroup) =>
                  DynamicPricingFactory.getOccupancyRules(rule)
              ),
            },
          ]
        : (roomTypes as FormArray).controls
            .filter((item) => item.get('isSelected').value)
            ?.map((room: FormGroup) => {
              const { occupancy, roomId } = room.controls;
              const configItem: ConfigItemType = {
                type: configCategory.value,
                id: roomId.value ?? undefined,
                configRules: (occupancy as FormArray).controls.map(
                  (rule: FormGroup) =>
                    DynamicPricingFactory.getOccupancyRules(rule)
                ),
              };
              return configItem;
            }) ?? [],
    } as DynamicPricingRequest;
  }

  static getChangedProperties(formGroup: FormGroup, type: ConfigType) {
    let requestData: DynamicPricingUpdateRequestType = {};
    let removedRulesIds = [];
    const otherDirtyMapper = (
      currentControl,
      name: OccupancyFormControlsType
    ) => {
      if (name === 'removedRules') {
        removedRulesIds = [...removedRulesIds, ...currentControl['controls']];
      } else if (
        name == 'fromDate' ||
        name == 'toDate' ||
        name == 'selectedDays'
      ) {
        const dependentControlList: OccupancyFormControlsType[] = [
          'fromDate',
          'toDate',
          'selectedDays',
        ];
        if (dependentControlList.includes(name)) {
          dependentControlList.forEach((item) => {
            const days = formGroup.get(item).value;
            if (item === 'selectedDays') {
              requestData['daysIncluded'] = days;
            } else {
              requestData[item] = days;
            }
          });
        }
      } else if (name == 'name') {
        requestData['name'] = currentControl.value;
      } else if (name == 'status') {
        requestData[name] = currentControl.value ? 'ACTIVE' : 'INACTIVE';
      } else if (name == 'roomType') {
        /**
         * We are collecting bunch of occupancyRules which is exist in multiple rule, if any unselected
         */
        let unselectedRulesIds = (formGroup.controls[
          'roomTypes'
        ] as FormArray).controls
          .filter(
            (item: FormGroup) =>
              !currentControl.value.includes(item.value.roomId)
          )
          .reduce((acc: string[], curr: FormGroup) => {
            const occupancyRule = curr.get('occupancy') as FormArray;
            return [
              ...acc,
              ...occupancyRule.controls.reduce(
                (accRule: string[], rule: FormGroup) => {
                  return [
                    ...accRule,
                    DynamicPricingFactory.getOccupancyRules(rule).id,
                  ];
                },
                []
              ),
            ];
          }, []);
        removedRulesIds = [
          ...removedRulesIds,
          ...unselectedRulesIds.filter((item) => item),
        ];
      }
    };

    Object.keys(formGroup.controls).forEach(
      (name: OccupancyFormControlsType) => {
        const currentControl = formGroup.controls[name];
        if (currentControl.dirty) {
          if (formGroup.controls['configCategory'].value == 'ROOM_TYPE') {
            /**
             * We are collect the updated occupancyRules
             */
            if (name == 'roomTypes') {
              let occupancyRuleData: {
                type: ConfigCategory;
                id: string;
                configRules: ConfigRuleType[];
              }[] = [];
              const selectedRoomType = [
                ...formGroup.controls['roomType'].value,
              ];
              occupancyRuleData = (currentControl as FormArray).controls
                .filter((item: FormGroup) =>
                  selectedRoomType.includes(item.get('roomId').value)
                )
                .reduce((accumulator, roomType: FormGroup) => {
                  const { occupancy } = roomType.controls;
                  if (roomType.dirty) {
                    const rules = (occupancy as FormArray).controls.map(
                      (occupancyRule: FormGroup) =>
                        DynamicPricingFactory.getOccupancyRules(occupancyRule)
                    );
                    accumulator.push({
                      type: 'ROOM_TYPE',
                      id: roomType.get('roomId').value,
                      configRules: rules,
                    });
                  }
                  return accumulator;
                }, occupancyRuleData);

              if (occupancyRuleData.length) {
                requestData['configItems'] = occupancyRuleData;
              }
            } else {
              otherDirtyMapper(currentControl, name);
            }
          } else {
            if (name == 'hotelConfig') {
              requestData['configItems'] = [
                {
                  type: 'HOTEL',
                  id: formGroup.get('hotelId').value,
                  configRules: [
                    ...(formGroup.get(
                      'hotelConfig'
                    ) as FormArray).controls.map((rule: FormGroup) =>
                      DynamicPricingFactory.getOccupancyRules(rule)
                    ),
                  ],
                },
              ];
            } else {
              otherDirtyMapper(currentControl, name);
            }
          }
        }
      }
    );
    removedRulesIds.length && (requestData['removedRules'] = removedRulesIds);
    return requestData;
  }

  static getOccupancyRules(rule: FormGroup): ConfigRuleType {
    const { id, discount, end, rate, start, fromTime, toTime } = rule.controls;
    const status = true; //TODO, Future dependent
    return {
      ...(id?.value && { id: id.value }),
      occupancyStart: +start?.value,
      occupancyEnd: +end?.value,
      status: status ? 'ACTIVE' : 'INACTIVE',
      discountOrMarkup: {
        type: 'PERCENTAGE',
        value: +discount?.value,
      },
      ...(fromTime?.value && { fromTimeInMillis: +fromTime.value }),
      ...(toTime?.value && { toTimeInMillis: +toTime.value }),
    };
  }
}

export class DynamicPricingHandler {
  dataList: DynamicPricingForm[];
  deserialize(input: DynamicPricingResponse, rooms?: RoomTypes[]) {
    this.dataList =
      input.configDetails?.map((item) =>
        new DynamicPricingForm().deserialize(item, rooms)
      ) ?? [];
    return this;
  }

  mapOccupancy(
    seasonIndex: number,
    item: DynamicPricingForm,
    instance: OccupancyComponent
  ) {
    instance.add('season');
    const season = instance.dynamicPricingControl.occupancyFA.at(
      seasonIndex
    ) as FormGroup;
    season.patchValue({
      id: item.id,
      fromDate: item.fromDate,
      toDate: item.toDate,
      type: 'update',
      name: item.name,
      configCategory: item.configCategory,
      selectedDays: item.selectedDays,
      status: item.status,
      basePrice: item.basePrice,
    });
    season.get('configCategory').disable();
    if (item.configCategory == 'HOTEL') {
      season.patchValue({
        configCategory: 'HOTEL',
        hotelId: item?.hotelId,
      });

      season.get('roomType').disable();
      season.removeControl('hotelConfig');
      season.addControl(
        'hotelConfig',
        instance.fb.array(
          Array.from(
            { length: item.hotelConfig.length },
            () => instance.seasonOccupancyFG
          )
        )
      );
      instance.listenChanges();
      this.mapHotelConfig(
        season.get('hotelConfig') as FormArray,
        item,
        'OCCUPANCY'
      );
    } else {
      //filtering rooms who has at least one rule
      season.patchValue({
        configCategory: 'ROOM_TYPE',
        roomType: item.roomType,
      });
      const roomTypesControl = season.get('roomTypes') as FormArray;
      const roomTypesControlList = roomTypesControl.controls.filter(
        (control: FormGroup) =>
          item.roomType.includes(control.get('roomId').value)
      );

      roomTypesControlList.forEach((roomControl: FormGroup, index) => {
        roomControl.removeControl('occupancy');
        roomControl.addControl(
          'occupancy',
          instance.fb.array(
            Array.from(
              { length: item.roomTypes[index].occupancy.length },
              () => instance.seasonOccupancyFG
            )
          )
        );
        //subscribing new occupancy rules
        instance.listenChanges();

        //patching all values of rules
        const { occupancy } = roomControl.controls;
        item.roomTypes[index].occupancy.sort((a, b) => a.start - b.start);
        (occupancy as FormArray).controls.forEach(
          (occupancyControl: FormGroup, occupancyIndex) => {
            const rule = item.roomTypes[index]?.occupancy[occupancyIndex];
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

  mapHotelConfig(
    formArray: FormArray,
    item: DynamicPricingForm,
    type: ConfigType
  ) {
    formArray.controls.forEach((hotelOccupancy: FormGroup, index) => {
      const rule = item.hotelConfig[index];
      const triggerConfig =
        type == 'DAY_TIME_TRIGGER'
          ? {
              fromTime: rule?.fromTime,
              toTime: rule?.toTime,
            }
          : {};
      rule &&
        hotelOccupancy.patchValue({
          id: rule.id,
          start: rule.start,
          end: rule.end,
          discount: rule.discount,
          ...triggerConfig,
        });
    });
  }

  mapDayTimeTrigger(
    triggerIndex: number,
    item: DynamicPricingForm,
    instance: DayTimeTriggerComponent
  ) {
    instance.modifyTriggerFG(Revenue.add);
    const triggerFG = instance.dynamicPricingControl.timeFA.at(
      triggerIndex
    ) as FormGroup;
    triggerFG.patchValue({
      id: item.id,
      hotelId: item.id,
      fromDate: item.fromDate,
      toDate: item.toDate,
      type: 'update',
      name: item.name,
      selectedDays: item.selectedDays,
      status: item.status,
    });

    triggerFG.addControl(
      'hotelConfig',
      instance.fb.array(
        Array.from({ length: item.hotelConfig.length - 1 }, () =>
          instance.modifyLevelFG(triggerFG, Revenue.add)
        )
      )
    );
    instance.listenChanges(triggerFG);
    this.mapHotelConfig(
      triggerFG.get('hotelConfig') as FormArray,
      item,
      'DAY_TIME_TRIGGER'
    );
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
  hotelId?: string;
  hotelConfig: OccupancyRuleType[];
  basePrice: number;
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
    this.selectedDays = input.daysIncluded;
    this.basePrice = rooms && rooms.find((item) => item.isBase).price;

    const getRules = (configRules) => {
      return (
        configRules.map((rule) => ({
          ...(rule?.id && { id: rule.id }),
          start: rule.occupancyStart,
          end: rule.occupancyEnd,
          discount: rule.discountOrMarkup.value,
          ...(rule?.fromTimeInMillis && { fromTime: rule.fromTimeInMillis }),
          ...(rule?.toTimeInMillis && { toTime: rule.toTimeInMillis }),
        })) ?? []
      );
    };

    if (input.configItems.some((item) => item.type === 'ROOM_TYPE')) {
      this.hotelConfig = [];
      this.roomType = input.configItems.map((item) => item.id);
      this.roomTypes = input.configItems.map((room, index) => {
        this.configCategory = room.type;
        const currentRoom = rooms.find((item) => item.value == room.id);
        let roomConfig: RoomsConfigType = {
          isSelected: false,
          roomId: room.id,
          basePrice: currentRoom?.price,
          roomName: currentRoom?.label,
          occupancy: getRules(room.configRules),
        };
        return roomConfig;
      });
    } else {
      this.roomType = [];
      this.roomTypes = [];
      this.hotelConfig = input.configItems.reduce((acc, curr) => {
        this.configCategory = curr.type;
        this.hotelId = curr.id;
        return getRules(curr.configRules);
      }, []);
    }

    return this;
  }
}
