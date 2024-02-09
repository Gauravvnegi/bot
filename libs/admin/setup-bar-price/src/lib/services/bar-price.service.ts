import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  Rooms,
  RoomTypes,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { UpdateBarPriceRequest } from '../types/bar-price.types';

@Injectable()
export class BarPriceService extends ApiService {
  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  getRoomDetails(entityId) {
    return this.get(
      `/api/v1/entity/${entityId}/inventory?roomTypeStatus=true&inventoryUpdateType=SETUP_BAR_PRICE&type=ROOM_TYPE&offset=0&limit=${100}`
    );
  }

  resetRoomDetails() {
    this.isRoomDetailsLoaded = false;
    this.roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  }

  loadRoomTypes(entityId: string) {
    this.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(new Rooms().deserialize(rooms));
    });
  }

  updateBarPrice(
    entityId: string,
    data: UpdateBarPriceRequest,
    config: QueryConfig
  ): Observable<UpdateBarPriceRequest> {
    return this.patch(
      `/api/v1/entity/${entityId}/inventory${config.params}`,
      data
    );
  }
}
