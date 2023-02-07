import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { records, stats } from '../constant/response';
import { QueryConfig, TableValue } from '../types/room';
import {
  RoomListResponse,
  RoomTypeListResponse,
  RoomStatus,
} from '../types/service-response';

@Injectable()
export class RoomService extends ApiService {
  list: Record<TableValue, string> = {
    roomType: 'room-type',
    room: 'room',
  };

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
          roomTypes: res.map((item) => ({
            ...item,
            roomCount: {
              active: Math.floor(Math.random() * 100),
              unavailable: Math.floor(Math.random() * 100),
              soldOut: Math.floor(Math.random() * 100),
            },
          })),
          roomTypeStatusCount: records.roomType,
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
          rooms: res,
          roomStatusCount: records.room,
        };
      })
    );
  }

  updateStatus(
    hotelId: string,
    table: TableValue,
    data: { id: string; status?: boolean; roomStatus?: RoomStatus }
  ) {
    return this.patch(
      `/api/v1/entity/${hotelId}/inventory/${this.list[table]}`,
      data
    );
  }

  exportCSV(hotelId: string, table: TableValue, config?: QueryConfig) {
    const { params } = config;
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/${this.list[table]}/export${
        params ?? ''
      }`
    );
  }
}
