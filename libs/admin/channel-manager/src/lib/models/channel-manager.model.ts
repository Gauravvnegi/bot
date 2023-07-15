import { RoomMapType } from '../types/channel-manager.types';
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

export class UpdateRates {
  dynamicPricing = new Map<number, boolean>();
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
          this.ratesRoomDetails = new Map();
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

  static buildRequestData(formData, fromDate: number) {}
}
