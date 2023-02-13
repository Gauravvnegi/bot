import { RoomStatus } from '../types/service-response';
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
          status: 'ACTIVE',
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
  // source: string;
  currency: string;
  price: number;
  roomTypeId: string;

  deserialize(input: SingleRoomData) {
    this.id = input.id;
    this.roomNumber = input.roomNo;
    this.floorNumber = input.floorNo;
    this.roomStatus = input.status;
    this.currency = input.currency;
    this.price = input.price;
    this.roomTypeId = input.roomType.id;
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
          status: 'ACTIVE',
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
  roomStatus: string;
  // source: string;
  currency: string;
  price: number;
  roomTypeId: string;

  deserialize(input: MultipleRoomData) {
    this.from = input.from;
    this.to = input.to;
    this.floorNumber = input.floorNo;
    this.roomStatus = input.status;
    this.currency = input.currency;
    this.price = input.price;
    this.roomTypeId = input.roomType.id;
    return this;
  }
}
