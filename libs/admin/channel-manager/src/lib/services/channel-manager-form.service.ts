import { Injectable } from '@angular/core';
import { RoomTypes } from '../types/channel-manager.types';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChannelManagerService } from './channel-manager.service';
import { makeRoomsData } from '../models/bulk-update.models';

@Injectable()
export class ChannelManagerFormService {
  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);

  constructor(private channelMangerService: ChannelManagerService) {}

  reset() {
    this.isRoomDetailsLoaded = false;
    this.roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  }

  loadRoomTypes(entityId: string) {
    this.channelMangerService.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(makeRoomsData(rooms));
    });
  }
}
