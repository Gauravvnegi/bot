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

  reset() {
    this.roomDetails.next([]);
  }

  loadRoomTypes(hotelId) {
    // this.roomDetails = roomTypeData;
    this.get(
      `/api/v1/entity/${hotelId}/inventory?type=ROOM_TYPE&offset=0&limit=${100}`
    ).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
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
