import { Injectable } from '@angular/core';
import { roomTypeData } from '../constants/data';

@Injectable()
export class ChannelManagerFormService {
  roomDetails = [];
  //reviewPoint: add type (already written in type files)

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
