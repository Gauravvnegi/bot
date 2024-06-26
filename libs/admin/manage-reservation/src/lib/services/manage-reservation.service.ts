import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { Observable } from 'rxjs';
import { ReservationSummary } from '../types/forms.types';
import { MenuItemListResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import {
  BookingSlotResponse,
  RoomReservationResponse,
  RoomUpgradeType,
} from '../types/response.type';

@Injectable({ providedIn: 'root' })
export class ManageReservationService extends ApiService {
  getRoomTypeList(
    entityId: string,
    config?: QueryConfig
  ): Observable<RoomTypeListResponse> {
    return this.get(`/api/v1/entity/${entityId}/inventory${config?.params}`);
  }

  getPaymentMethod(entityId: string): Observable<any> {
    return this.get(
      // `/api/v1/entity/${entityId}/configuration?configType=PAYMENT&status=ACTIVE`
      `/api/v1/payment/configurations/admin?entity_id=${entityId}&status=ACTIVE`
    );
  }

  getRoomTypeToUpgrade(reservationId: string, config: QueryConfig) {
    return this.get(
      `/api/v1/booking/${reservationId}/upgrade${config?.params}`
    );
  }

  upgradeRoomType(reservationId: string, data: RoomUpgradeType) {
    return this.put(
      `/api/v1/booking/${reservationId}/upgrade?type=ROOM_TYPE`,
      data
    );
  }

  rateImprovement(entityId: string, reservationId: string, data: any) {
    return this.put(
      `/api/v1/booking/${reservationId}/price-differences?entityId=${entityId}&type=ROOM_TYPE`,
      data
    );
  }

  getUpgradeRoomTypes(entityId: string, config: QueryConfig) {
    return this.get(`/api/v1/entity/${entityId}/inventory${config.params}`);
  }

  createReservation(entityId: string, data, bookingType): Observable<any> {
    return this.post(`/api/v1/booking?type=${bookingType}`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  getOfferByRoomType(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/library/${config.params}`);
  }

  getReservationDataById(bookingId: string, entityId: string): Observable<any> {
    return this.get(
      `/api/v1/booking/${bookingId}?entityId=${entityId}&raw=true`
    );
  }

  updateReservation<T, K>(
    entityId: string,
    reservationId: string,
    data: any,
    bookingType: string
  ): Observable<K> {
    return this.put(
      `/api/v1/booking/${reservationId}?type=${bookingType}&entityId=${entityId}`,
      data
    );
  }

  updateCalendarView(
    reservationId: string,
    data: any,
    bookingType: string
  ): Observable<RoomReservationResponse> {
    return this.patch(
      `/api/v1/booking/${reservationId}?type=${bookingType}`,
      data
    );
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(
    entityId: string,
    config?: QueryConfig
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/library/search${config?.params ?? ''}`
    );
  }

  updateBookingStatus(
    bookingId: string,
    entityId: string,
    bookingType: string,
    data: { reservationType: string; remarks: string }
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}/status?type=${bookingType}&entityId=${entityId}`,
      data
    );
  }

  getRoomNumber(entityId: string, config: QueryConfig) {
    return this.get(`/api/v1/entity/${entityId}/inventory${config.params}`);
  }

  getSummaryData(
    entityId: string,
    data: ReservationSummary,
    config: QueryConfig
  ): Observable<any> {
    return this.post(`/api/v1/booking/summary${config?.params}`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  getReservationItems<T>(config?: QueryConfig, id?: string): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`, {
      headers: { 'entity-id': id },
    });
  }

  getMenuList(outletId: string): Observable<MenuItemListResponse> {
    return this.get(
      `/api/v1/menus/items?entityId=${outletId}&pagination=false`,
      {
        headers: { 'entity-id': outletId },
      }
    );
  }

  getReservationItemsByCategory<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`);
  }

  exportCSV(config?: QueryConfig) {
    return this.get(`/api/v1/booking/export${config?.params ?? ''}`, {
      responseType: 'blob',
    });
  }

  emailInvoice(reservationId: string, data) {
    return this.post(
      `/api/v1/reservation/${reservationId}/send-invoice?source=BOTSHOT_ADMIN`,
      data
    );
  }

  getSlotsListsByRoomType(
    config: QueryConfig
  ): Observable<BookingSlotResponse[]> {
    return this.get(`/api/v1/booking-slots${config.params ?? ''}`);
  }
}
