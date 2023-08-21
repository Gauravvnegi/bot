import { FormArray, FormGroup } from '@angular/forms';
import {
  ConfigItemType,
  ConfigRuleType,
  ConfigType,
  DynamicPricingRequest,
  OccupancyFormControlsType,
  OccupancyUpdateRequestType,
  ModeType,
  DynamicPricingResponse,
  ConfigCategory,
  RoomsConfigType,
  OccupancyRuleType,
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
              id: hotelId.value,
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
                id: roomId.value,
                configRules: (occupancy as FormArray).controls.map(
                  (rule: FormGroup) =>
                    DynamicPricingFactory.getOccupancyRules(rule)
                ),
              };
              return configItem;
            }) ?? [],
    } as DynamicPricingRequest;
  }

  static getChangedProperties(formGroup: FormGroup) {
    let requestData: OccupancyUpdateRequestType = {};
    let removedRulesIds = [];
    Object.keys(formGroup.controls).forEach(
      (name: OccupancyFormControlsType) => {
        const currentControl = formGroup.controls[name];
        if (currentControl.dirty) {
          const mapOtherControl = () => {
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
            name != 'hotelConfig' && (requestData[name] = currentControl.value);
          };

          if (formGroup.controls['configCategory'].value == 'ROOM_TYPE') {
            // for room type
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

              requestData['configItems'] = [
                {
                  type: 'ROOM_TYPE',
                  id: '',
                  configRules: [...occupancyRuleData],
                },
              ];
            } else if (name === 'roomType') {
              //Finding deleted rules who is unselected from roomTypes
              const removedRules = (formGroup.controls[
                'roomTypes'
              ] as FormArray).controls
                .filter((roomType) => !roomType.get('isSelected').value)
                .map((roomType) =>
                  (roomType.get('occupancy') as FormArray).controls
                    .filter((rules) => rules.get('id')?.value)
                    .map((rules) => rules.get('id').value)
                )
                .reduce((acc, val) => acc.concat(val), []);
              removedRulesIds = [...removedRulesIds, ...removedRules];
            } else {
              mapOtherControl();
            }
          } else {
            // for hotel type
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
            }
            mapOtherControl();
          }

          if (name === 'removedRules') {
            removedRulesIds = [
              ...removedRulesIds,
              ...currentControl['controls'],
            ];
          }
        }
      }
    );
    removedRulesIds.length && (requestData['removedRules'] = removedRulesIds);
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

      (season.get('hotelConfig') as FormArray).controls.forEach(
        (hotelOccupancy: FormGroup, index) => {
          const rule = item.hotelConfig[index];
          rule &&
            hotelOccupancy.patchValue({
              id: rule.id,
              start: rule.start,
              end: rule.end,
              discount: rule.discount,
            });
        }
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
    this.basePrice = rooms.find((item) => item.isBase).price;

    const getRules = (configRules) => {
      return (
        configRules.map((rule) => ({
          id: rule?.id,
          start: rule.occupancyStart,
          end: rule.occupancyEnd,
          discount: rule.discountOrMarkup.value,
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
