import { RoomFoStatus, RoomStatus, StatusDetails } from './service-response';

/**
 * Base Room Form Structure
 */
export type BaseRoomForm = {
  id?: string;
  roomTypeId: string;
  price: number;
  currency: string;
  status?: RoomStatus;
  featureIds: string[];
  removeFeatures?: string[];
  remarks?: string;
  statusDetailsList?: StatusDetails[];
  currentStatusTo?: number;
  currentStatusFrom?: number;
  rooms?: any;
};

//  ******** Single Room Interface ********

type SingleRoomBase = { roomNo: string; floorNo: string };

export type SingleRoomForm = BaseRoomForm & {
  rooms: SingleRoomBase[];
};

export type SingleRoomData = SingleRoomBase & BaseRoomForm;

//  ******** Multiple Room Interface ********

type MultipleRoomBase = {
  from: string;
  to: string;
  floorNo: number;
};

export type MultipleRoomForm = BaseRoomForm & {
  rooms: MultipleRoomBase[];
};

export type MultipleRoomData = MultipleRoomBase & BaseRoomForm;

export type StatusQuoForm = {
  status: RoomStatus;
  remarks: string;
  foStatus: RoomFoStatus;
  toDate: string;
  fromDate: string;
  id?: string;
};
