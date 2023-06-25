import { Injectable } from '@angular/core';
import { roomTypeData } from '../constants/data';

@Injectable()
export class ChannelManagerFormService {
  private roomsData = [];

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
    return this.roomsData;
  }
}
