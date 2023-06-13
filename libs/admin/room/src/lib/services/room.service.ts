import { Injectable } from '@angular/core';
import { ApiService, DateService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { TableValue } from '../constant/data-table';
import {
  RoomTypeData,
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
  roomTypeFormData: Partial<RoomTypeFormData> = {
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

  getStats(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/stats/inventory/room${config.queryObj}`
    );
  }

  getServices(
    hotelId: string,
    config?: QueryConfig
  ): Observable<ServiceResponse> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }

  getRoomTypes(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/inventory?type=ROOM_TYPE`);
  }

  getList<T extends RoomTypeListResponse | RoomListResponse>(
    hotelId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        // --refactor ---will be removed
        if (this.selectedTable === TableValue.room) {
          res.entityStateCounts = {
            CLEAN: 10,
            INSPECTED: 15,
            OUT_OF_SERVICE: 18,
            OUT_OF_ORDER: 25,
            UNAVAILABLE: 12,
          };

          res.total = 80;
          const rooms = res['rooms'];
          {
            rooms.forEach((item) => {
              const foStatus = Math.random() < 0.5 ? 'OCCUPIED' : 'VACANT';
              item['foStatus'] = foStatus;
              const isOccupied = foStatus === 'OCCUPIED';
              if (isOccupied) {
                item['toDate'] = new Date().getTime();
                item['fromDate'] =
                  new Date().getTime() + 2 * 24 * 60 * 60 * 1000;
              }
              item['roomStatus'] = isOccupied ? 'DIRTY' : 'CLEAN';
              item['nextStates'] = isOccupied
                ? ['CLEAN', 'OUT_OF_SERVICE']
                : ['DIRTY', 'INSPECTED'];
            });
          }
        }

        return res;
      })
    );
  }

  updateRoomStatus(
    hotelId: string,
    data: { rooms: [{ id: string; roomStatus: RoomStatus }] }
  ): Observable<RoomResponse> {
    return this.patch(`/api/v1/entity/${hotelId}/inventory?type=ROOM`, data);
  }

  updateRoomTypeStatus(
    hotelId: string,
    data: { id: string; status: boolean }
  ): Observable<RoomTypeResponse> {
    return this.patch(
      `/api/v1/entity/${hotelId}/inventory?type=ROOM_TYPE`,
      data
    );
  }

  addRooms(
    hotelId: string,
    data: { rooms: SingleRoom[] | MultipleRoom[] }
  ): Observable<AddRoomsResponse> {
    return this.post(`/api/v1/entity/${hotelId}/inventory?type=ROOM`, data);
  }

  updateRoom(
    hotelId: string,
    data: { rooms: SingleRoom[] }
  ): Observable<RoomResponse> {
    return this.put(`/api/v1/entity/${hotelId}/inventory?type=ROOM`, data);
  }

  getRoomById(hotelId: string, roomId: string): Observable<RoomByIdResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/${roomId}?type=ROOM`
    ).pipe(
      map((res) => {
        // -- refactor-- will be removed
        const item = res['rooms'][0];
        item['foStatus'] = 'VACANT';
        item['roomStatus'] = 'CLEAN';
        item['remarks'] = 'Room is cleaned';
        return res;
      })
    );
  }

  exportCSV(hotelId: string, table: TableValue, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/${
        table === TableValue.room ? 'room' : 'room-type'
      }/export${config.params ?? ''}`,
      { responseType: 'blob' }
    );
  }

  createRoomType(hotelId: string, data: any): Observable<RoomTypeResponse> {
    return this.post(
      `/api/v1/entity/${hotelId}/inventory?type=ROOM_TYPE`,
      data
    );
  }

  getRoomTypeById(
    hotelId: string,
    roomTypeId: string
  ): Observable<RoomTypeResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/inventory/${roomTypeId}?type=ROOM_TYPE`
    );
  }

  updateRoomType(
    hotelId: string,
    data: RoomTypeData
  ): Observable<RoomTypeResponse> {
    return this.put(`/api/v1/entity/${hotelId}/inventory?type=ROOM_TYPE`, data);
  }
}
