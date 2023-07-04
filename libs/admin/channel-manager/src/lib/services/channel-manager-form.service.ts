import { Injectable } from '@angular/core';
import { roomTypeData } from '../constants/data';
import { RoomTypes } from '../types/channel-manager.types';

@Injectable()
export class ChannelManagerFormService {
  roomDetails: RoomTypes[] = [];

  constructor() {
    this.setRoomTypes();
  }

  reset() {
    this.roomDetails = [];
  }

  setRoomTypes() {
    this.roomDetails = roomTypeData;
  }
}
