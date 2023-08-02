import { Injectable } from '@angular/core';
import { channels, ratePlans, roomTypeData } from '../constants/data';
import { RoomTypes } from '../types/channel-manager.types';
import { ApiService } from '@hospitality-bot/shared/utils';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { ChannelManagerService } from './channel-manager.service';
import { makeRoomsData } from '../models/bulk-update.models';

@Injectable()
export class ChannelManagerFormService {
  // roomDetails: RoomTypes[] = [];

  constructor(private channelMangerService: ChannelManagerService) {}

  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  RatePlan = {
    SUITE: 'SUITE',
    EXECUTIVE: 'EXECUTIVE',
  };

  reset() {
    this.isRoomDetailsLoaded = false;
    this.roomDetails.next([]);
  }

  loadRoomTypes(entityId) {
    this.channelMangerService.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
      //TODO: Filter for only two room
      // .filter(
      //   (item) =>
      //     item.name === this.RatePlan.EXECUTIVE ||
      //     item.name === this.RatePlan.SUITE
      // );

      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(makeRoomsData(rooms));
    });
  }
}
