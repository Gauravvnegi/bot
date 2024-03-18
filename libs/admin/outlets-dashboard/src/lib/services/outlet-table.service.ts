import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SelectedEntity } from 'libs/admin/manage-reservation/src/lib/types/reservation.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateOrderData, CreateReservationData } from '../types/form';
import {
  ReservationTableListResponse,
  PosOrderResponse,
  OrderReservationStatus,
} from '../types/reservation-table';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import {
  AreaListResponse,
  GuestReservationListResponse,
  GuestReservationResponse,
  TableListResponse,
} from '../types/outlet.response';
import { OrderSummaryData, OrderSummaryResponse } from '../types/menu-order';
import { TableReservationListResponse } from '../types/table-booking.response';

@Injectable()
export class OutletTableService extends ApiService {
  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);

  getOrderById(
    entityId: string,
    orderId: string
  ): Observable<PosOrderResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/order/${orderId}`,
      this.preDefinedHeaders
    );
  }

  getPaymentMethod(entityId: string) {
    return this.get(
      `/api/v1/payment/configurations/admin?entity_id=${entityId}&status=ACTIVE`
    );
  }

  getAllCategories(menuIds: string) {
    return this.get(
      `/api/v1/menus/categories?entityState=ACTIVE&menuIds=${menuIds}`,
      this.preDefinedHeaders
    );
  }

  exportCSV(entityId, config): Observable<any> {
    return this.get(
      `/api/v1/outlets/export/${config.queryObj}`,
      this.preDefinedHeaders
    );
  }

  getOrderSummary(data: OrderSummaryData): Observable<OrderSummaryResponse> {
    return this.post(
      `/api/v1/booking/summary?type=OUTLET`,
      data,
      this.preDefinedHeaders
    );
  }

  updateOutletItem(entityId, outletId, status): Observable<any> {
    return this.patch(
      `/api/v1/user/${outletId}/sites/${entityId}?status=${status}`,
      {},
      this.preDefinedHeaders
    );
  }

  createOrder(entityId: string, data: CreateOrderData) {
    return this.post(
      `/api/v1/entity/${entityId}/order`,
      data,
      this.preDefinedHeaders
    );
  }

  updateOrder(entityId: string, orderId: string, data: CreateOrderData) {
    return this.patch(
      `/api/v1/entity/${entityId}/order/${orderId}`,
      data,
      this.preDefinedHeaders
    );
  }

  updateOrderStatus(
    entityId: string,
    orderId: string,
    data: { status: OrderReservationStatus }
  ) {
    return this.patch(
      `/api/v1/entity/${entityId}/order/${orderId}`,
      data,
      this.preDefinedHeaders
    );
  }

  createReservation(data: CreateReservationData) {
    return this.post(
      `/api/v1/booking?type=OUTLET`,
      data,
      this.preDefinedHeaders
    );
  }

  getTableReservations(
    entityId: string,
    config: QueryConfig
  ): Observable<ReservationTableListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/order${config.params}`,
      this.preDefinedHeaders
    );
  }

  getFilteredMenuItems(config: QueryConfig) {
    return this.get(
      `/api/v1/menus/items${config?.params}`,
      this.preDefinedHeaders
    );
  }

  getList<T extends TableListResponse | AreaListResponse>(
    entityId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`,
      this.preDefinedHeaders
    );
  }

  getGuestReservationList(
    config: QueryConfig,
    entityId: string
  ): Observable<GuestReservationListResponse> {
    return this.get(`/api/v1/booking${config?.params}`, this.preDefinedHeaders);
  }

  getOffer(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/library/${config.params}`,
      this.preDefinedHeaders
    );
  }

  getGuestReservationById(id: string): Observable<GuestReservationResponse> {
    return this.get(
      `/api/v1/booking/${id}?type=OUTLET&outletType=RESTAURANT`,
      this.preDefinedHeaders
    );
  }

  updateGuestReservation(
    id: string,
    reservation
  ): Observable<GuestReservationResponse> {
    return this.put(
      `/api/v1/booking/${id}?type=OUTLET&outletType=RESTAURANT`,
      reservation,
      this.preDefinedHeaders
    );
  }

  updateBookingStatus(
    reservationId: string,
    config: QueryConfig,
    data: { status?: string; remarks?: string; currentJourney?: string }
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${reservationId}${config?.params ?? {}}`,
      data,
      this.preDefinedHeaders
    );
  }
  cancelReservation(
    reservationId: string,
    config: QueryConfig,
    data: { status?: string; remarks?: string; currentJourney?: string }
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${reservationId}/status${config?.params ?? {}}`,
      data,
      this.preDefinedHeaders
    );
  }

  getLiveTableList(
    entityId: string,
    config: QueryConfig
  ): Observable<TableReservationListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/inventory${config?.params ?? ''}`,
      this.preDefinedHeaders
    );
  }

  searchBooking(config: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/search/bookings${config?.params ?? ''}`,
      this.preDefinedHeaders
    );
  }
}
