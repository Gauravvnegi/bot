import { FormGroup } from '@angular/forms';
import { pick, reduce } from 'lodash';
import {
  RoomMapType,
  UpdateInventoryType,
  UpdateRatesType,
} from '../types/channel-manager.types';
import {
  ChannelManagerResponse,
  Rates,
  UpdateInventoryResponse,
  UpdateRatesResponse,
} from '../types/response.type';

export class UpdateInventory {
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
    });
    return this;
  }

  static buildAvailability(
    input: UpdateInventoryResponse[],
    selectedRooms: string[]
  ) {
    let perDayRoomAvailability = new Map<
      number,
      {
        roomAvailable: number;
        occupancy: number;
      }
    >();
    input.map((item) => {
      const selectedAvailability = pick(item.inventoryDataMap, selectedRooms);
      const totalSelectedRooms = Object.keys(selectedAvailability).length;
      perDayRoomAvailability[item.startDate] = {
        roomAvailable: reduce(
          selectedAvailability,
          (sum, curr) => sum + curr['available'],
          0
        ),
        occupancy:
          reduce(
            selectedAvailability,
            (sum, curr) => sum + curr['occupancy'],
            0
          ) / totalSelectedRooms,
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
            rooms.rooms.filter((filterItem) => filterItem.available) ?? [];

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
      console.log(day, selectedDays.includes(day));
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
  ratesRoomDetails = new Map<string, RoomMapType>();

  deserialize(input: ChannelManagerResponse) {
    input.updates?.forEach((currentData) => {
      const currentDay = currentData.startDate ?? currentData.endDate;
      // rate plan iteration
      const ratePlanData = currentData.inventoryDataMap;
      Object.keys(ratePlanData).forEach((currentRoomId) => {
        const { available, occupancy } = ratePlanData[currentRoomId];
        if (!this.ratesRoomDetails[currentRoomId]) {
          // if first time create
          this.ratesRoomDetails[currentRoomId] = {
            availability: new Map(),
            ratePlans: new Map(),
          };
        }
        this.ratesRoomDetails[currentRoomId].availability[currentDay] = {
          quantity: available,
          occupancy: occupancy,
          dynamicPrice: false,
        };
      });

      // all rates plan on current day
      currentData.rates.forEach((currentRatePlan) => {
        const currentRoomId = currentRatePlan.roomTypeId;
        const currentRatePlanId = currentRatePlan.ratePlanId;
        // For each room type
        this.ratesRoomDetails[currentRoomId].availability[
          currentDay
        ].dynamicPrice = currentRatePlan.dynamicPricing;

        if (!this.ratesRoomDetails[currentRoomId]) {
          this.ratesRoomDetails[currentRoomId] = {
            availability: new Map(),
            ratePlans: new Map(),
          };
        }

        var currentDayPlan = this.ratesRoomDetails[currentRoomId].ratePlans[
          currentRatePlanId
        ];

        if (!currentDayPlan) {
          this.ratesRoomDetails[currentRoomId].ratePlans[
            currentRatePlanId
          ] = new Map();
        }
        this.ratesRoomDetails[currentRoomId].ratePlans[currentRatePlanId][
          currentDay
        ] = {
          date: currentDay,
          available: currentRatePlan.rate,
        };
      });
    });

    return this;
  }

  static buildDynamicPricing(input: ChannelManagerResponse) {
    let dynamicPricing = new Map<string, Map<string, number>>();
    (input.updates as UpdateRatesResponse[])?.forEach((currentData) => {
      currentData.rates.forEach((ratePlans) => {
        if (!dynamicPricing[ratePlans.roomTypeId]) {
          dynamicPricing[ratePlans.roomTypeId] = new Map();
        }
        dynamicPricing[ratePlans.roomTypeId][ratePlans.ratePlanId] =
          ratePlans.rate;
      });
    });
    return dynamicPricing;
  }
  static buildRequestData(
    formData,
    fromDate: number,
    type: 'submit-form' | 'dynamic-pricing'
  ) {
    let updates: UpdateRatesType[] = [];

    let selectedDate = new Date(fromDate);
    formData.roomTypes.forEach((room) => {
      room.ratePlans.forEach((ratePlan) => {
        selectedDate = new Date(fromDate);
        updates = ratePlan.rates.map((rate, dayIndex) => {
          const rates = {
            roomTypeId: room.value,
            rate: rate.value ? +rate.value : null,
            ratePlanId: ratePlan.value,
            dynamicPricing: room['dynamicPrice'][dayIndex]?.value, // get current day dynamic pricing status from Map, if required ex- dynamicPricingMap[currentDay]
          };

          let perDayData = {
            startDate: selectedDate.getTime(),
            endDate: selectedDate.getTime(),
            rates: updates[dayIndex]
              ? [...updates[dayIndex]?.rates, rates]
              : [rates],
          };

          // filter rates plan who have not any input on this particular day
          perDayData.rates = perDayData.rates.filter((item) =>
            type === 'submit-form' ? item.rate : true
          );
          selectedDate.setDate(selectedDate.getDate() + 1);
          return perDayData;
        });
      });
    });

    // filter data who haven't exist any rate plans
    return {
      updates: updates.filter((item) =>
        type === 'submit-form' ? item.rates.length > 0 : true
      ),
    };
  }

  static buildBulkUpdateRequest(formData) {
    let updates: UpdateRatesType[] = [];
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
          rates: roomTypes.map((item) => ({
            roomTypeId: item.roomTypeId,
            rate: +updateValue,
            ratePlanId: item.ratePlanId,
            dynamicPricing: false, // TODO, Manage dynamic pricing according to your need
          })),
        });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return updates;
  }
}
