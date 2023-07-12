import { Injectable } from '@angular/core';
import { channels, ratePlans, roomTypeData } from '../constants/data';
import { RoomTypes } from '../types/channel-manager.types';
import { ApiService } from '@hospitality-bot/shared/utils';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ChannelManagerFormService extends ApiService {
  // roomDetails: RoomTypes[] = [];
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
    this.get(
      `/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE&offset=0&limit=${100}`
    ).subscribe((res) => {
      const rooms = new RoomTypeList()
        .deserialize(res)
        .records.filter(
          (item) =>
            item.id === this.RatePlan.EXECUTIVE ||
            item.id === this.RatePlan.SUITE
        );
      this.roomDetails.next(
        rooms.map((item) => ({
          label: item.name,
          value: item.id,
          channels: channels,
          ratePlans: ratePlans,
        }))
      );
    });
  }
}
