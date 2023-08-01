import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { TableValue } from '../constant/data-table';
import {
  RoomTypeFormData,
  ServicesTypeValue,
} from '../constant/form';
import { MultipleRoom, SingleRoom } from '../models/room.model';
import { QueryConfig } from '../types/room';
import {
  AddRoomsResponse,
  RoomByIdResponse,
  RoomListResponse,
  RoomResponse,
  RoomStatus,
  RoomTypeListResponse,
  RoomTypeResponse,
  ServiceResponse,
} from '../types/service-response';

@Injectable()
export class RoomService extends ApiService {
  /** [ROOM | ROOM_TYPE] Selected Table */
  selectedTable = TableValue.roomType;

  /** [PAID | COMPLIMENTARY] Selected service to be shown in service page  */
  selectedService: ServicesTypeValue;
  /** Represent is room type form data is available */
  roomTypeFormState: boolean = false;
  /** State to handle syncing of services and room type form data */
  roomTypeFormData: Partial<RoomTypeFormData> & {
    services: any[];
  } = {
    services: [],
    complimentaryAmenities: [],
    paidAmenities: [],
  };

  initRoomTypeFormData(
    input: Partial<RoomTypeFormData>,
    service: ServicesTypeValue,
    roomTypeFormState: boolean
  ) {
    this.roomTypeFormData = { ...this.roomTypeFormData, ...input };
    this.selectedService = service;
    this.roomTypeFormState = roomTypeFormState;
  }

  resetRoomTypeFormState() {
    this.roomTypeFormState = false;
  }

  resetSelectedService() {
    this.selectedService = undefined;
  }

  getStats(entityId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/stats/inventory/room${config.queryObj}`
    );
  }

  getServices(
    entityId: string,
    config?: QueryConfig
  ): Observable<ServiceResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library${config?.params ?? ''}`,
      { headers: { 'hotel-id': entityId } }
    );
  }

  getRoomTypes(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`);
  }

  getList<T extends RoomTypeListResponse | RoomListResponse>(
    entityId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`
    );
  }

  updateRoomStatus(
    entityId: string,
    data: { rooms: [{ id: string; status: RoomStatus }] }
  ): Observable<RoomResponse> {
    return this.patch(`/api/v1/entity/${entityId}/inventory?type=ROOM`, data);
  }

  updateRoomTypeStatus(
    entityId: string,
    data: { id: string; status: boolean }
  ): Observable<RoomTypeResponse> {
    return this.patch(
      `/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`,
      data
    );
  }

  addRooms(
    entityId: string,
    data: { rooms: SingleRoom[] | MultipleRoom[] }
  ): Observable<AddRoomsResponse> {
    return this.post(`/api/v1/entity/${entityId}/inventory?type=ROOM`, data);
  }

  updateRoom(
    entityId: string,
    data: { rooms: SingleRoom[] }
  ): Observable<RoomResponse> {
    return this.put(`/api/v1/entity/${entityId}/inventory?type=ROOM`, data);
  }

  getRoomById(entityId: string, roomId: string): Observable<RoomByIdResponse> {
    return this.get(`/api/v1/entity/${entityId}/inventory/${roomId}?type=ROOM`);
  }

  exportCSV(entityId: string, table: TableValue, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${entityId}/inventory/${
        table === TableValue.room ? 'room' : 'room-type'
      }/export${config.params ?? ''}`,
      { responseType: 'blob' }
    );
  }

  createRoomType(entityId: string, data): Observable<any> {
    return this.post(
      `/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`,
      data
    );
  }

  getRoomTypeById(
    entityId: string,
    roomTypeId: string
  ): Observable<RoomTypeResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory/${roomTypeId}?type=ROOM_TYPE`
    );
  }

  updateRoomType(entityId: string, data: any): Observable<any> {
    return this.put(
      `/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`,
      data
    );
  }

  updateHotel(entityId: string, data): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}?type=HOTEL`, data);
  }

  getFeatures(): Observable<any> {
    return this.get(`/api/v1/config?key=SERVICE_CONFIGURATION`);
  }
}
