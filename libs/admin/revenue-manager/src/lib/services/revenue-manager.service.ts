import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { Observable } from 'rxjs';

@Injectable()
export class RevenueManagerService extends ApiService {
  getRoomDetails(entityId): Observable<RoomTypeListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory?roomTypeStatus=true&type=ROOM_TYPE&offset=0&limit=${100}`
    );
  }
}
