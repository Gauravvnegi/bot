import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { stats } from '../constant/response';
import { MultipleRoom, SingleRoom } from '../models/room.model';
import { QueryConfig, TableValue } from '../types/room';
import {
  RoomListResponse,
  RoomTypeListResponse,
  RoomStatus,
  RoomResponse,
  AddRoomsResponse,
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
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/room-type${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        return {
          roomTypes: res.roomTypes.map((item) => ({
            ...item,
            roomCount: {
              active: Math.floor(Math.random() * 100),
              unavailable: Math.floor(Math.random() * 100),
              soldOut: Math.floor(Math.random() * 100),
            },
          })),
          roomTypeStatusCount: res.roomTypeStatusCount,
        };
      })
    );
  }

  getRoomsList(
    hotelId: string,
    config?: QueryConfig
  ): Observable<RoomListResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/rooms${config?.params ?? ''}`
    );
  }

  updateStatus(
    hotelId: string,
    table: TableValue,
    data: { id: string; status?: boolean; roomStatus?: RoomStatus }
  ): Observable<RoomResponse | RoomListResponse> {
    return this.patch(
      `/api/v1/entity/${hotelId}/inventory/${this.list[table]}`,
      data
    );
  }

  addRooms(
    hotelId: string,
    data: SingleRoom[] | MultipleRoom[]
  ): Observable<AddRoomsResponse> {
    return this.post(`/api/v1/entity/${hotelId}/inventory/room`, data);
  }

  updateRoom(hotelId: string, data: SingleRoom): Observable<RoomResponse> {
    return this.put(`/api/v1/entity/${hotelId}/inventory/room`, data);
  }

  getRoomById(hotelId: string, roomId: string): Observable<RoomResponse> {
    return this.get(`/api/v1/entity/${hotelId}/inventory/room/${roomId}`);
  }

  exportCSV(hotelId: string, table: TableValue, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/${this.list[table]}/export${
        config.params ?? ''
      }`
    );
  }

  createRoomType(hotelId: string, data: any) {
    return this.post(`/api/v1/entity/${hotelId}/inventory/room-type`, data);
  }

  getRoomTypeById(hotelId: string, roomTypeId: string) {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/room-type/${roomTypeId}`
    );
  }

  updateRoomType(hotelId: string, roomTypeId: string, data: any) {
    return this.put(`/api/v1/entity/${hotelId}/inventory/room-type`, data);
  }
}
