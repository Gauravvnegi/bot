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

  constructor(
    private channelMangerService: ChannelManagerService,
    private configService: ConfigService
  ) {}

  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  RatePlan = {
    SUITE: 'SUITE',
    EXECUTIVE: 'EXECUTIVE',
  };

  reset() {
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
      let configRatePlans = [];
      this.configService.$config.subscribe((data) => {
        configRatePlans = data.roomRatePlans;
      });
      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(makeRoomsData(rooms, configRatePlans));
    });
  }
}
