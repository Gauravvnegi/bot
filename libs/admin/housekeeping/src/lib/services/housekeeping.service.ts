import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HousekeepingService extends ApiService {
   
  refreshData = new BehaviorSubject<boolean>(false); // to refresh the data



  getList<RoomListResponse>(
    entityId: string,
    config?: QueryConfig
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`
    );
  }

  getRoomTypeList(
    entityId: string,
    config?: QueryConfig
  ): Observable<RoomTypeListResponse> {
    return this.get(`/api/v1/entity/${entityId}/inventory${config?.params}`);
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(entityId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/library/search${config?.params ?? ''}`
    );
  }
}
