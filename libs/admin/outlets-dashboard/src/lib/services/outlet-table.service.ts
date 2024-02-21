import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SelectedEntity } from 'libs/admin/manage-reservation/src/lib/types/reservation.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dineInReservationResponse } from '../constants/data-table';
import { CreateOrderData, CreateReservationData } from '../types/form';
import {
  ReservationTableListResponse,
  ReservationTableResponse,
} from '../types/reservation-table';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import {
  AreaListResponse,
  GuestReservationListResponse,
  TableListResponse,
} from '../types/outlet.response';

@Injectable()
export class OutletTableService extends ApiService {
  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);

  getOrderById(
    entityId: string,
    orderId: string
  ): Observable<ReservationTableResponse> {
    return this.get(`/api/v1/entity/${entityId}/order/${orderId}`);
  }

  getReservations(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory?type=ROOM_TYPE`).pipe(
      map((res) => {
        return dineInReservationResponse;
      })
    );
  }

  getPaymentMethod(entityId: string) {
    return this.get(
      `/api/v1/payment/configurations/admin?entity_id=${entityId}&status=ACTIVE`
    );
  }

  getAllCategories(menuIds: string) {
    return this.get(
      `/api/v1/menus/categories?entityState=ACTIVE&menuIds=${menuIds}`
    );
  }

  exportCSV(entityId, config): Observable<any> {
    return this.get(`/api/v1/outlets/export/${config.queryObj}`);
  }

  updateOutletItem(entityId, outletId, status): Observable<any> {
    return this.patch(
      `/api/v1/user/${outletId}/sites/${entityId}?status=${status}`,
      {}
    );
  }

  createOrder(entityId: string, data: CreateOrderData) {
    return this.post(`/api/v1/entity/${entityId}/order`, data);
  }

  createReservation(data: CreateReservationData) {
    return this.post(`/api/v1/booking?type=OUTLET`, data);
  }

  getTableReservations(
    entityId: string,
    config: QueryConfig
  ): Observable<ReservationTableListResponse> {
    return this.get(`/api/v1/entity/${entityId}/order${config.params}`);
  }

  getFilteredMenuItems(config: QueryConfig) {
    return this.get(`/api/v1/menus/items${config?.params}`);
  }

  getList<T extends TableListResponse | AreaListResponse>(
    entityId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`
    );
  }

  getGuestReservation(): Observable<GuestReservationListResponse> {
    return this.get(`/api/v1/booking?type=OUTLET&outletType=RESTAURANT`);
  }
}
