import { RoomTypeFormData } from '../constant/form';
import { RoomStatus, RoomTypeResponse } from '../types/service-response';
import {
  MultipleRoomData,
  MultipleRoomForm,
  SingleRoomData,
  SingleRoomForm,
} from '../types/use-form';

export class SingleRoomList {
  list: SingleRoom[];
  deserialize(input: SingleRoomForm) {
    this.list = new Array<SingleRoom>();
    const { rooms, ...rest } = input;
    rooms.forEach((item) => {
      this.list.push(
        new SingleRoom().deserialize({
          ...item,
          ...rest,
        })
      );
    });

    return this;
  }
}

export class SingleRoom {
  id: string;
  roomNumber: string;
  floorNumber: string;
  roomStatus: RoomStatus;
  currency: string;
  price: number;
  roomTypeId: string;

  deserialize(input: SingleRoomData) {
    this.id = input.id ?? '';
    this.roomNumber = input.roomNo ?? '';
    this.floorNumber = input.floorNo ?? '';
    this.roomStatus = input.status;
    this.currency = input.currency ?? '';
    this.price = input.price ?? null;
    this.roomTypeId = input.roomTypeId ?? '';
    return this;
  }
}

export class MultipleRoomList {
  list: MultipleRoom[];
  deserialize(input: MultipleRoomForm) {
    this.list = new Array<MultipleRoom>();
    const { rooms, ...rest } = input;
    rooms.forEach((item) => {
      this.list.push(
        new MultipleRoom().deserialize({
          ...item,
          ...rest,
        })
      );
    });
    return this;
  }
}

export class MultipleRoom {
  from: string;
  to: string;
  floorNumber: number;
  roomStatus: RoomStatus;
  currency: string;
  price: number;
  roomTypeId: string;

  deserialize(input: MultipleRoomData) {
    this.from = input.from ?? '';
    this.to = input.to ?? '';
    this.floorNumber = input.floorNo ?? null;
    this.roomStatus = input.status;
    this.currency = input.currency ?? '';
    this.price = input.price;
    this.roomTypeId = input.roomTypeId ?? '';
    return this;
  }
}

export class RoomTypeForm {
  status: boolean;
  name: string;
  imageUrls: string[];
  description: string;
  complimentaryAmenities: string[];
  paidAmenities: string[];
  originalPrice: number;
  discountType: string;
  discountValue: number;
  discountedPrice: number;
  variablePriceCurrency: string;
  currency: string;
  variableAmount: number;
  discountedPriceCurrency: string;
  maxOccupancy: number;
  maxChildren: number;
  maxAdult: number;
  area: number;

  deserialize(input: RoomTypeResponse): RoomTypeFormData {
    this.status = input.status;
    this.name = input.name;
    this.imageUrls = input.imageUrls;
    this.description = input.description;
    this.complimentaryAmenities =
      input.complimentaryAmenities?.map((item) => item.id) ?? [];
    this.paidAmenities = input.paidAmenities?.map((item) => item.id) ?? [];
    this.originalPrice = input.originalPrice;
    this.discountType = input.discountType;
    this.discountValue = input.discountValue;
    this.discountedPrice = input.discountedPrice;
    this.variablePriceCurrency = input.currency;
    this.currency = input.currency;
    this.variableAmount = input.variableAmount;
    this.discountedPriceCurrency = input.currency;
    this.maxOccupancy = input.maxOccupancy;
    this.maxChildren = input.maxChildren;
    this.maxAdult = input.maxAdult;
    this.area = input.area;

    return this;
  }
}
