import { Injectable } from '@angular/core';
import { channels, ratePlans, roomTypeData } from '../constants/data';
import { RoomTypes } from '../types/channel-manager.types';
import { ApiService } from '@hospitality-bot/shared/utils';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { ChannelManagerService } from './channel-manager.service';

@Injectable()
export class ChannelManagerFormService {
  // roomDetails: RoomTypes[] = [];

  constructor(
    private channelMangerService: ChannelManagerService,
    private configService: ConfigService
  ) {}

  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  RatePlan = {
    SUITE: '61bb58e1-962f-47da-bcbf-2281b09df91c',
    EXECUTIVE: '37139fa5-7dea-4e73-830c-2bf3abb83e85',
  };

  reset() {
    this.roomDetails.next([]);
  }

  loadRoomTypes(entityId) {
    // this.roomDetails = roomTypeData;
    this.channelMangerService.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList()
        .deserialize(res)
        .records.filter(
          (item) =>
            item.id === this.RatePlan.EXECUTIVE ||
            item.id === this.RatePlan.SUITE
        );

      let configRatePlans = [];
      this.configService.$config.subscribe((data) => {
        configRatePlans = data.roomRatePlans;
      });

      this.roomDetails.next(
        rooms.map((item) => {
          let room = {
            label: item.name,
            value: item.id,
            channels: [],
            ratePlans: item.ratePlans.map((ratePlan) => {
              let rates = configRatePlans.find(
                (configRates) => configRates.id === ratePlan.value
              );
              let myRatePlan = {
                ...ratePlan,
                type: rates.id,
                label: rates.label,
              };
              return myRatePlan;
            }),
          };
          return room;
        })
      );

      // this.roomDetails.subscribe((value) => {
      //   debugger;
      // });
    });
  }
}
