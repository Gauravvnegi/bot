import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { records, stats } from '../constant/response';
import { QueryConfig } from '../types/room';
import {
  RoomListResponse,
  RoomTypeListResponse,
} from '../types/service-response';

@Injectable()
export class RoomService extends ApiService {
  getStats(hotelId: string): Observable<any> {
    return this.get(`/api/v1/packages?hotelId=${hotelId}`).pipe(
      map((res) => {
        return stats;
      })
    );
  }

  getAmenities(hotelId: string): Observable<any> {
    return this.get(`/api/v1/packages?hotelId=${hotelId}`);
  }

  getRoomTypes(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/inventory/room-type`);
  }

  getRoomsTypeList(
    hotelId: string,
    config?: QueryConfig
  ): Observable<RoomTypeListResponse> {
    const { params } = config;
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/room-type${params ?? ''}`
    ).pipe(
      map((res) => {
        return {
          records: res,
          counts: records.roomType,
        };
      })
    );
  }

  getRoomsList(
    hotelId: string,
    config?: QueryConfig
  ): Observable<RoomListResponse> {
    const { params } = config;
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/rooms${params ?? ''}`
    ).pipe(
      map((res) => {
        return {
          records: res,
          counts: records.room,
        };
      })
    );
  }
}
