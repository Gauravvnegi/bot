import { Injectable } from '@angular/core';
import { roomTypeData } from '../constants/data';

@Injectable()
export class ChannelManagerFormService {
  private roomsData = [];
  //reviewPoint: add type (already written in type files)

  constructor() {
    this.setRoomTypes();
  }

  reset() {
    this.roomsData = [];
  }

  setRoomTypes() {
    this.roomsData = roomTypeData;
  }

  get getRoomsData() {
    //reviewPoint: name should not be getRoomsData ??
    return this.roomsData;
  }
}
