import {
  RatePlanForm,
  UpdateRateFormObj,
} from './../../../../manage-rate/src/lib/components/update-rates/update-rates.component';
import { pick, reduce } from 'lodash';
import {
  DynamicPricingType,
  PriceInfo,
  RoomMapType,
  UpdateInventoryType,
  UpdateRatesType,
} from '../types/channel-manager.types';
import {
  UpdateInventoryResponse,
  UpdateRatesResponse,
} from '../types/response.type';
import { RATE_CONFIG_TYPE } from 'libs/admin/manage-rate/src/lib/constants/rates.const';
import { RoomTypes, Variant } from '../types/bulk-update.types';
import { RoomTypes as InventoryRoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
export class UpdateInventory {
  inventoryRoomDetails = new Map<
    string,
    {
      roomId: string;
      roomCode: string;
      availableRoom: number;
    }[]
  >();

  deserialize(input: UpdateInventoryResponse[]) {
    input?.forEach((item) => {
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
    });
    return this;
  }

  static buildAvailability(
    input: UpdateInventoryResponse[],
    selectedRooms: string[],
    roomTypes: InventoryRoomTypes[]
  ) {
    let perDayRoomAvailability = new Map<
      number,
      {
        roomAvailable: number;
        occupancy: number;
      }
    >();
    const totalRoomCount = roomTypes.reduce(
      (sum, curr) => sum + curr?.roomCount,
      0
    );

    input.map((item) => {
      let selectedAvailability = !selectedRooms
        ? item.inventoryDataMap
        : pick(item.inventoryDataMap, selectedRooms);
      const totalAvailable = reduce(
        selectedAvailability,
        (sum, curr) => sum + curr['available'],
        0
      );
      perDayRoomAvailability[item.startDate] = {
        roomAvailable: totalAvailable,
        occupancy: (
          ((totalRoomCount - totalAvailable) / totalRoomCount) *
          100
        ).toFixed(2),
      };
    });
    return perDayRoomAvailability;
  }
  static buildRequestData(formData, fromDate: number) {
    let updates: UpdateInventoryType[] = [];
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
            rooms.rooms.filter(
              (filterItem) => typeof filterItem.available == 'number'
            ) ?? [];

          currentDate.setDate(currentDate.getDate() + 1);
          return rooms.rooms.length > 0 && rooms;
        }) ?? [];
    });
    return updates.filter((item) => item) ?? [];
  }

  static buildBulkUpdateRequest(formData) {
    let updates: UpdateInventoryType[] = [];
    let { fromDate, toDate, roomTypes, selectedDays, updateValue } = formData;
    let currentDay = new Date(fromDate);
    let lastDay = new Date(toDate);
    lastDay.setDate(lastDay.getDate() + 1);
    while (currentDay.getTime() != lastDay.getTime()) {
      const day = currentDay.toLocaleDateString(undefined, { weekday: 'long' });

      selectedDays.includes(day) &&
        updates.push({
          startDate: currentDay.getTime(),
          endDate: currentDay.getTime(),
          rooms: roomTypes.value.roomTypeIds.map((item) => ({
            roomTypeId: item,
            available: +updateValue,
          })),
        });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return updates;
  }
}

export class UpdateRates {
  /**
   * Record to store room details and rates.
   * @type {Record<string, RoomRecordType>}
   */
  ratesRoomDetails: Record<string, RoomMapType> = {};

  /**
   * Deserialize the input data and update the rates room details.
   * @param {UpdateRatesResponse[]} input - The input data to be deserialized.
   * @returns {UpdateRates} - The updated UpdateRates instance.
   */
  deserialize(
    input: UpdateRatesResponse[],
    configType: RATE_CONFIG_TYPE
  ): UpdateRates {
    const isPaxType = configType === RATE_CONFIG_TYPE.pax;

    /**
     * Data Iterate day-wise
     * Mapping based on day
     */
    input?.forEach((currentData) => {
      const currentDay = currentData.startDate ?? currentData.endDate;
      // rate plan iteration
      const ratePlanData = currentData.inventoryDataMap;
      Object.keys(ratePlanData).forEach((currentRoomId) => {
        const { available, occupancy } = ratePlanData[currentRoomId];
        if (!this.ratesRoomDetails[currentRoomId]) {
          // if first time create
          this.ratesRoomDetails[currentRoomId] = {
            availability: {},
            ratePlans: {},
          };
        }
        this.ratesRoomDetails[currentRoomId].availability[currentDay] = {
          quantity: available,
          occupy: occupancy,
          dynamicPrice: false,
        };
      });

      /**
       * Iterating all rates &
       * Mapping their value,
       * NOTE: First rate plan should be the 1st PAX
       * if configuration will be PAX type
       */
      currentData.rates.forEach((currentRatePlan) => {
        const currentRoomId = currentRatePlan.roomTypeId;
        const currentRatePlanId = currentRatePlan.ratePlanId;
        // For each room type
        this.ratesRoomDetails[currentRoomId].availability[
          currentDay
        ].dynamicPrice = currentRatePlan.dynamicPricing;

        if (!this.ratesRoomDetails[currentRoomId]) {
          this.ratesRoomDetails[currentRoomId] = {
            availability: {},
            ratePlans: {},
          };
        }

        var currentDayPlan = this.ratesRoomDetails[currentRoomId].ratePlans[
          currentRatePlanId
        ];

        if (!currentDayPlan) {
          this.ratesRoomDetails[currentRoomId].ratePlans[
            currentRatePlanId
          ] = {};
        }

        /**
         * Collecting all pax of current,
         * RatePlan, and filtering except to PAX number 1,
         * NOTE: This will be execute if configuration will be
         * PAX type
         */
        let allPax: Record<number, number>;
        if (isPaxType) {
          allPax = currentData.rates
            .filter(
              (item) => item?.pax != 1 && item.ratePlanId == currentRatePlanId
            )
            .reduce((prev, curr) => ({ ...prev, [curr.pax]: curr.rate }), {});
        }

        const availabilityFilter = isPaxType
          ? (item) => item.pax === 1 && item.ratePlanId === currentRatePlanId
          : (item) => item.ratePlanId === currentRatePlanId;

        /**
         * Storing current RoomType of each RatePlan,
         * First will be the PAX 1 if configuration is PAX,
         * other pax will be stored in {[paxNumber]:paxValue} of list
         */
        this.ratesRoomDetails[currentRoomId].ratePlans[currentRatePlanId][
          currentDay
        ] = {
          name: currentRatePlan.roomCode,
          date: currentDay,
          available: currentData.rates.filter(availabilityFilter)?.[0]?.rate,
          ...(isPaxType &&
            ({
              pax: allPax,
            } as any)),
        };
      });
    });

    return this;
  }

  /**
   * Build dynamic pricing map from input data.
   * @param {UpdateRatesType} input - The input data to build dynamic pricing from.
   * @returns {Map<DynamicPricingType>} - The dynamic pricing map.
   */
  static buildDynamicPricing(
    input: UpdateRatesType,
    configType: RATE_CONFIG_TYPE
  ): Map<string, DynamicPricingType> {
    let dynamicPricing = new Map<string, DynamicPricingType>();
    input.rates.forEach((ratePlans) => {
      if (!dynamicPricing[ratePlans.roomTypeId]) {
        dynamicPricing[ratePlans.roomTypeId] = new Map();
      }

      if (ratePlans.pax == 1 || configType === RATE_CONFIG_TYPE.ratePlan) {
        dynamicPricing[ratePlans.roomTypeId][ratePlans.ratePlanId] = {
          price: ratePlans.rate,
        };
      } else if (configType === RATE_CONFIG_TYPE.pax) {
        let prevData: PriceInfo =
          dynamicPricing[ratePlans.roomTypeId][ratePlans.ratePlanId];
        dynamicPricing[ratePlans.roomTypeId][ratePlans.ratePlanId] = {
          ...prevData,
          pax: {
            ...prevData.pax,
            [ratePlans.pax]: ratePlans.rate,
          },
        };
      }
    });
    return dynamicPricing;
  }

  /**
   * Build request data for submitting form or dynamic pricing.
   * @param {Record<string, any>} formData - The form data.
   * @param {number} fromDate - The starting date.
   * @param {'submit-form' | 'dynamic-pricing'} type - The type of request.
   * @returns {object} - The built request data.
   */
  static buildRequestData(
    formData: UpdateRateFormObj,
    fromDate: number,
    type: 'submit-form' | 'dynamic-pricing',
    configType?: RATE_CONFIG_TYPE
  ): Record<'inventoryList', UpdateRatesType[]> {
    let updates: UpdateRatesType[] = [];
    const isPaxConfig = configType === RATE_CONFIG_TYPE.pax;
    // console.log(isPaxConfig);
    let selectedDate = new Date(fromDate);
    formData.roomTypes.forEach((room, roomIndex: number) => {
      let newRPType: Partial<RatePlanForm & { paxNumber: number }>[] = [];
      room.ratePlans.forEach((ratePlan) => {
        /**
         * Always consider first ratePlan as first pax
         * if configuration type is pax
         */
        newRPType.push({
          value: ratePlan.value,
          rates: ratePlan.rates,
          ...(isPaxConfig && { paxNumber: 1 }),
        });

        /**
         * When configuration type will pax
         * all pax will be the new rate plan,
         * with labeled paxNumber
         */
        if (isPaxConfig) {
          ratePlan.pax.forEach((pax, paxInd: number) => {
            newRPType.push({
              value: ratePlan.value,
              rates: pax.paxData,
              paxNumber: paxInd + 2,
            });
          });
        }
      });

      /**
       * Iterate and map all data of each rate plan
       * main section who is responsible for mapping of response
       */
      newRPType.forEach((ratePlan) => {
        selectedDate = new Date(fromDate);
        updates = ratePlan?.rates?.map((rate, dayIndex) => {
          const rates = {
            roomTypeId: room.value,
            rate: rate.value ? +rate.value : null,
            ratePlanId: ratePlan.value,
            dynamicPricing: room['dynamicPrice'][dayIndex]?.value, // get current day dynamic pricing status from Map, if required ex- dynamicPricingMap[currentDay]
            ...(isPaxConfig && {
              pax: ratePlan.paxNumber,
            }),
          };

          let dwData = {
            startDate: selectedDate.getTime(),
            endDate: selectedDate.getTime(),
            rates:
              updates && updates[dayIndex]
                ? [...updates[dayIndex]?.rates, rates]
                : [rates],
          };

          // filter rates plan who have not any input on this particular day
          dwData.rates = dwData.rates.filter((item) =>
            type === 'submit-form' ? typeof item.rate == 'number' : true
          );
          selectedDate.setDate(selectedDate.getDate() + 1);
          return dwData as UpdateRatesType;
        });
      });
    });

    // filter data who haven't exist any rate plans
    return {
      inventoryList:
        updates?.filter((item) =>
          type === 'submit-form' ? item.rates.length > 0 : true
        ) ?? [],
    };
  }

  /**
   * Updates rates for selected days based on the specified configuration.
   * Build bulk update request data.
   * @param {Record<string, any>} formData - The form data for bulk update.
   * @returns {UpdateRatesType[]} - The built bulk update request data.
   * @param {Date} currentDay - The starting date for rate updates.
   * @param {Date} lastDay - The last date for rate updates.
   * @param {string[]} selectedDays - An array of weekdays for which rates should be updated.
   * @param {string} roomInfo - The new rate value.
   * @param {string} roomTypes.roomTypeId - The ID of the room type.
   * @param {string} roomTypes.ratePlanId - The ID of the rate plan for the room type.
   * @param {number} configType - The configuration type (e.g., RATE_CONFIG_TYPE.pax).
   * @param {*}
   * @param {string} roomInfo.id - The ID of the room.
   * @param {Variant[]} roomInfo.variants - An array of room variants.} roomInfo - An array of room information.
   * @param {Object} roomInfo.variants.pax - Pax information for the room variant.
   * @param {Variant} Variant - Type representing a room variant.
   * @returns {UpdateRatesType[]} updates - An array of rate updates.
   */
  static buildBulkUpdateRequest(
    formData: Record<string, any>,
    configType?: RATE_CONFIG_TYPE,
    roomInfo?: RoomTypes[]
  ): UpdateRatesType[] {
    let updates: UpdateRatesType[] = [];
    let { fromDate, toDate, roomTypes, selectedDays, updateValue } = formData;
    let currentDay = new Date(fromDate);
    let lastDay = new Date(toDate);
    /**
     *  Loop through days from currentDay to lastDay
     */
    while (currentDay.getTime() <= lastDay.getTime()) {
      const day = currentDay.toLocaleDateString(undefined, { weekday: 'long' });
      selectedDays.includes(day) &&
        updates.push({
          startDate: currentDay.getTime(),
          endDate: currentDay.getTime(),
          rates: roomTypes.reduce((prev, currItem) => {
            let currRPInfo: Variant;
            // Check if the configuration type is pax
            if (configType == RATE_CONFIG_TYPE.pax) {
              // Find the current room based on roomTypeId
              const currentRoom = roomInfo.find(
                (room) => room.id == currItem.roomTypeId
              );

              // Find the rate plan info based on ratePlanId
              currRPInfo = currentRoom?.variants?.find(
                (rp) => rp.id == currItem.ratePlanId
              );
            }

            // Push the base rate update object to the rates array
            return [
              ...prev,

              // This is for only non pax base configuration, mapping
              ...(configType !== RATE_CONFIG_TYPE.pax
                ? [
                    {
                      roomTypeId: currItem.roomTypeId,
                      rate: +updateValue,
                      ratePlanId: currItem.ratePlanId,
                      dynamicPricing: false, // TODO, Manage dynamic pricing according to your need
                    },
                  ]
                : []),
              // If currRPInfo is available, push additional rate updates for pax
              ...(currRPInfo?.pax
                ?.filter((pax) => pax.isSelected)
                .map((paxInfo, paxInd: number) => ({
                  roomTypeId: currItem.roomTypeId,
                  rate: +updateValue,
                  pax: paxInfo?.id,
                  ratePlanId: currItem.ratePlanId,
                  dynamicPricing: false,
                })) ?? []),
            ];
          }, []),
        });

      currentDay.setDate(currentDay.getDate() + 1);
    }
    return updates;
  }
}
