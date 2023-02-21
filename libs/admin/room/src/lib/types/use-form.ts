import { RoomStatus } from './service-response';

/**
 * Base Room Form Structure
 */
export type BaseRoomForm = {
  id?: string;
  roomType: {
    id: string;
    label: string;
    price: number;
    currency: string;
  };
  price: number;
  currency: string;
};

//  ******** Single Room Interface ********

type SingleRoomBase = { roomNo: string; floorNo: string };

export type SingleRoomForm = BaseRoomForm & {
  rooms: SingleRoomBase[];
};

export type SingleRoomData = SingleRoomBase &
  BaseRoomForm & {
    status: RoomStatus;
  };

//  ******** Multiple Room Interface ********

type MultipleRoomBase = {
  from: string;
  to: string;
  floorNo: number;
};

export type MultipleRoomForm = BaseRoomForm & {
  rooms: MultipleRoomBase[];
};

export type MultipleRoomData = MultipleRoomBase &
  BaseRoomForm & {
    status: RoomStatus;
  };