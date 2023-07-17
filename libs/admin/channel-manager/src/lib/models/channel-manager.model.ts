import {
  RoomMapType,
  UpdateInventoryType,
  UpdateRatesType,
} from '../types/channel-manager.types';
import { ChannelManagerResponse } from '../types/response.type';

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
  dynamicPricing = new Map<number, boolean>();
  ratesRoomDetails = new Map<string, RoomMapType>();

  deserialize(input: ChannelManagerResponse) {
    input.updates?.forEach((currentData) => {
      const currentDay = currentData.startDate ?? currentData.endDate;
      this.ratesRoomDetails;
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
        };
      });
      // all rates plan on current day
      currentData.rates.forEach((currentRatePlan) => {
        this.dynamicPricing[currentDay] = currentRatePlan.dynamicPricing;

        const currentRoomId = currentRatePlan.roomTypeId;
        const currentRatePlanId = currentRatePlan.ratePlanId;

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

  static buildRequestData(formData, fromDate: number) {
    let dynamicPricingMap = new Map<number, boolean>();
    //if dynamic pricing true then do not send data of those date
    let updates: UpdateRatesType[] = [];

    let selectedDate = new Date(fromDate);
    formData.dynamicPricing.forEach((price) => {
      dynamicPricingMap[selectedDate.getTime()] = price.value;
      selectedDate.setDate(selectedDate.getDate() + 1);
    });

    formData.roomTypes.forEach((room) => {
      room.ratePlans.forEach((ratePlan) => {
        selectedDate = new Date(fromDate);
        updates = ratePlan.rates.map((rate, dayIndex) => {
          const rates = {
            roomTypeId: room.value,
            rate: rate.value ? +rate.value : null,
            ratePlanId: ratePlan.value,
            dynamicPricing: false, // get current day dynamic pricing status from Map, if required ex- dynamicPricingMap[currentDay]
          };

          let perDayData = {
            startDate: selectedDate.getTime(),
            endDate: selectedDate.getTime(),
            rates: updates[dayIndex]
              ? [...updates[dayIndex]?.rates, rates]
              : [rates],
          };

          // filter rates plan who have not any input on this particular day
          perDayData.rates = perDayData.rates.filter((item) => item.rate);
          selectedDate.setDate(selectedDate.getDate() + 1);
          return perDayData;
        });
      });
    });

    // filter data who haven't exist any rate plans
    return { updates: updates.filter((item) => item.rates.length > 0) };
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
