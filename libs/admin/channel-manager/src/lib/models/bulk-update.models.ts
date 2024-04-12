import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { PAX } from 'libs/admin/manage-rate/src/lib/constants/rates.const';
import {
  PricingDetails,
  RoomType,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { Variant } from '../types/bulk-update.types';

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
  ): FormArray {
    let filteredData = data.filter((item) =>
      selectedRooms.includes(item.value)
    );
    const roomDataFromArray = new FormArray([]);

    filteredData = filteredData.length === 0 ? [...data] : [...filteredData];
    type ObjectType = typeof buildType.isInventory extends boolean
      ? Variant
      : RoomTypes;

    filteredData.map((item, index) => {
      const roomTypeFormGroup = new FormGroup({
        id: new FormControl(item.id),
        name: new FormControl(item.label),
        isSelected: new FormControl(item.isSelected),
        [buildType.isInventory ? 'channels' : 'variants']: new FormArray([]),
        price: new FormControl(0),
        isBase: new FormControl(item.isBaseRoomType),
        available: new FormControl(0),
      });

      const getChannels = (parent) => {
        return parent['channels']?.map((item) => {
          return new FormGroup({
            id: new FormControl(item.value),
            name: new FormControl(item.label),
            isSelected: new FormControl(true),
            price: new FormControl(0),
          });
        });
      };

      if (buildType.isInventory) {
        if (item['channels'].length) {
          const control = roomTypeFormGroup.get('channels') as FormArray;
          control.controls.push(...getChannels(item));
        }
      } else {
        for (let ratePlan of item['ratePlans']) {
          //Ep , cp
          const ratePlanGroup: FormGroup = new FormGroup({
            id: new FormControl(ratePlan.value),
            name: new FormControl(ratePlan.label),
            isSelected: new FormControl(false),
            isBase: new FormControl(ratePlan.isBase),
            variablePrice: new FormControl(ratePlan.variablePrice),
            price: new FormControl(0),

            pax: new FormArray(
              ratePlan['pax']
                .filter((item) => item.value !== 'Single')
                .map((paxItem: Pax, paxIndex: number) => {
                  const control = new FormGroup({
                    id: new FormControl(paxItem?.id),
                    name: new FormControl(
                      `${ratePlan.label} - ${paxItem.label}`
                    ),
                    isSelected: new FormControl(false),
                    basePrice: new FormControl(
                      calculateOccupancyPricing(
                        paxItem.id,
                        ratePlan.pricingDetails,
                        ratePlan.variablePrice,
                        ratePlan.type === 'CP (with breakfast)'
                      )
                    ),
                    price: new FormControl(0),
                  });

                  return control;
                })
            ),
          });

          const control = roomTypeFormGroup.get('variants') as FormArray;
          control.controls.push(ratePlanGroup);

          //updated child
          control?.controls?.forEach((variantControl) => {
            variantControl.get('price')?.valueChanges?.subscribe((res) => {
              const paxControl = variantControl.get('pax') as FormArray;
              paxControl?.controls?.forEach((pax) => {
                const price = +pax.get('basePrice').value + +res;
                pax.get('price').patchValue(price);
              });
            });
          });

          //update siblings
          const baseControl = control?.controls?.find(
            (item) => item.get('isBase').value
          );
          baseControl?.get('price')?.valueChanges.subscribe((res) => {
            control?.controls
              .filter((control) => control !== baseControl)
              .forEach((item) => {
                const price = +item.get('variablePrice').value + +res;
                item.get('price').patchValue(price);
              });
          });
        }
      }

      //update base level value
      if (item.isBase) {
        const baseControl = (roomTypeFormGroup.get(
          'variants'
        ) as FormArray)?.controls?.find((item) => item.get('isBase').value);

        baseControl?.get('price')?.valueChanges?.subscribe((res) => {
          roomDataFromArray?.controls
            ?.filter((item) => !item.get('isBase').value)
            .forEach((item) => {
              const variantControls = item.get('variants') as FormArray;

              const baseControl = variantControls?.controls?.find(
                (item) => item.get('isBase').value
              );

              const price = +baseControl.get('variablePrice').value + +res;
              baseControl.get('price').patchValue(price);
            });
        });
      }

      roomDataFromArray.push(roomTypeFormGroup);
    }) as ObjectType[];

    return roomDataFromArray;
  }
}

function calculateOccupancyPricing(
  id: number,
  pricingDetails: {
    paxDoubleOccupancy: number;
    paxTripleOccupancy: number;
    paxAdult: number;
  },
  variablePrice?: number,
  isCpRatePlan?: boolean
): number {
  switch (id) {
    case 2:
      return !isCpRatePlan
        ? pricingDetails['paxDoubleOccupancy']
        : +pricingDetails['paxDoubleOccupancy'] + +variablePrice;

    case 3:
      return !isCpRatePlan
        ? pricingDetails['paxTripleOccupancy']
        : pricingDetails['paxTripleOccupancy'] + (id - 1) * +variablePrice;

    default:
      const price = !isCpRatePlan
        ? (id - 3) * pricingDetails.paxAdult +
          pricingDetails['paxTripleOccupancy']
        : (id - 3) * pricingDetails.paxAdult +
          pricingDetails['paxTripleOccupancy'] +
          (id - 1) * variablePrice;

      return price;
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
  pax: Pax[] = [];
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
    for (let paxInd = 0; paxInd < maxOccupancy; paxInd++) {
      this.pax.push(
        new Pax({ label: PAX[paxInd], value: PAX[paxInd], id: paxInd + 1 })
      );
    }
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

export class Pax {
  label: string;
  value: string;
  isSelected?: boolean;
  id?: number;
  price?: number;
  constructor(input: Pax) {
    this.label = input.label ?? '';
    this.value = input.value ?? '';
    this.isSelected = input.isSelected ?? true;
    this.id = input?.id;
  }
}
