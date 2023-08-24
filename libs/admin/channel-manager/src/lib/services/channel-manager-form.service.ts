import { Injectable } from '@angular/core';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { BehaviorSubject } from 'rxjs';
import { ChannelManagerService } from './channel-manager.service';
import {
  Rooms,
  RoomTypes,
} from 'libs/admin/revenue-manager/src/lib/models/bar-price.model';

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
      this.roomDetails.next(new Rooms().deserialize(rooms, 'channel-manager'));
    });
  }
}
