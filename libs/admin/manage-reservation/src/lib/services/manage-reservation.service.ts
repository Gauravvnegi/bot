import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { Observable } from 'rxjs';
import { ReservationSummary } from '../types/forms.types';
import { map } from 'rxjs/operators';
import { MenuItemListResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable()
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

  createReservation(entityId: string, data, bookingType): Observable<any> {
    return this.post(`/api/v1/booking?type=${bookingType}`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  getOfferByRoomType(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/library/${config.params}`);
  }

  getReservationDataById(bookingId: string, entityId: string): Observable<any> {
    return this.get(`/api/v1/booking/${bookingId}?entityId=${entityId}`);
  }

  updateReservation<T, K>(
    entityId: string,
    reservationId: string,
    data: any
  ): Observable<K> {
    return this.put(
      `/api/v1/booking/${reservationId}?bookingType=ROOM_TYPE&entityId=${entityId}`,
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
    data: { reservationType: string }
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}?bookingType=${bookingType}&entityId=${entityId}`,
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
}
