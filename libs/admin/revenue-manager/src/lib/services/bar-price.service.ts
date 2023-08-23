import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject } from 'rxjs';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { Rooms, RoomTypes } from '../models/bar-price.model';

@Injectable()
export class BarPriceService extends ApiService {
  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  getRoomDetails(entityId) {
    return this.get(
      `/api/v1/entity/${entityId}/inventory?roomTypeStatus=true&type=ROOM_TYPE&offset=0&limit=${100}`
    );
  }

  loadRoomTypes(entityId: string) {
    this.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(new Rooms().deserialize(rooms));
    });
  }
}
