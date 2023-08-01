import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationTableValue } from '../constants/reservation-table';
import { ReservationFormData } from '../types/forms.types';
import { QueryConfig } from '../types/reservation.type';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EntityType } from '@hospitality-bot/admin/shared';
import { SummaryData } from '../models/reservations.model';

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

  getOfferByRoomType(entityId: string, roomTypeId: string): Observable<any> {
    // `/api/v1/entity/${entityId}/inventory/room/${roomTypeId}`
    return this.get(
      `/api/v1/payment/configurations/admin?entity_id=${entityId}&status=ACTIVE`
    ).pipe(
      map((res) => {
        res = {
          offers: [
            {
              id: 1,
              description: 'AGENT0020',
            },
            {
              id: 2,
              description: 'AGENT0202',
            },
          ],
        };
        return res;
      })
    );
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
    data
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}?bookingType=${bookingType}&entityId=${entityId}`,
      data
    );
  }

  addGuest(data) {
    return this.post('api/v1/members?type=GUEST', data);
  }

  getSummaryData(entityId: string, data, config: QueryConfig): Observable<any> {
    return this.post(`/api/v1/booking/summary${config?.params}`, data, {
      headers: { 'entity-id': entityId },
    });
  }

  getReservationItems<T>(config?: QueryConfig, id?: string): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`, {
      headers: { 'entity-id': id },
    });
  }

  getReservationItemsByCategory<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`);
  }

  exportCSV(config?: QueryConfig) {
    return this.get(`/api/v1/booking/export${config?.params ?? ''}`, {
      responseType: 'blob',
    });
  }

  mapReservationData(formValue) {
    const reservationData = new ReservationFormData();
    // reservationData.firstName = formValue.guestInformation.firstName ?? '';
    // reservationData.lastName = formValue.guestInformation.lastName ?? '';
    // reservationData.email = formValue.guestInformation.email ?? '';
    // reservationData.contact = {
    //   countryCode: formValue?.guestInformation?.countryCode ?? '',
    //   phoneNumber: formValue?.guestInformation?.phoneNumber ?? '',
    // };
    // reservationData.guestDetails = formValue.guestInformation.guestDetails;
    // reservationData.roomTypeId = formValue.roomInformation?.roomTypeId ?? '';
    // reservationData.adultCount = formValue.roomInformation?.adultCount ?? 0;
    // reservationData.childCount = formValue.roomInformation?.childCount ?? 0;
    // reservationData.roomCount = formValue.roomInformation?.roomCount ?? 0;
    reservationData.from = formValue.reservationInformation.from ?? 0;
    reservationData.to = formValue.reservationInformation.to ?? 0;
    reservationData.reservationType =
      formValue.reservationInformation.reservationType ?? '';
    reservationData.source = formValue.reservationInformation.source ?? '';
    reservationData.sourceName =
      formValue.reservationInformation.sourceName ?? '';
    reservationData.marketSegment =
      formValue.reservationInformation.marketSegment ?? '';
    reservationData.paymentMethod = formValue.paymentMethod.paymentMethod ?? '';
    reservationData.totalPaidAmount =
      formValue.paymentMethod.totalPaidAmount ?? 0;
    reservationData.offerId = formValue.offerId ?? '';
    reservationData.paymentRemark = formValue.paymentMethod.paymentRemark ?? '';
    return reservationData;
  }

  getReservationList(
    entityId,
    config: QueryConfig = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        res.records = [
          {
            invoiceId: 1682254737883,
            outletName: 'Outlet 1',
            bookingNumber: '1682254737883',
            guestName: 'Rajesh',
            date: '2021-05-21',
            time: '12:00 PM',
            totalDueAmount: 100,
            totalAmount: 1000,
            source: 'Agent',
            paymentMethod: 'Cash',
            reservationType: 'DRAFT',
            status: 'Paid',
            statusValues: ['Paid', 'Unpaid'],
          },
          {
            invoiceId: 1682254737883,
            outletName: 'Outlet 1',
            bookingNumber: '1682254737883',
            guestName: 'Rajesh',
            date: '2021-05-21',
            time: '12:00 PM',
            totalDueAmount: 100,
            totalAmount: 1000,
            source: 'Agent',
            paymentMethod: 'Cash',
            reservationType: 'CONFIRMED',
            status: 'Paid',
            statusValues: ['Paid', 'Unpaid'],
          },
          {
            invoiceId: 1682254737883,
            outletName: 'Outlet 1',
            bookingNumber: '1682254737883',
            guestName: 'Rajesh',
            from: '2021-05-21 12:00 PM',
            to: '2021-05-21 12:00 PM',
            totalDueAmount: 100,
            totalAmount: 1000,
            source: 'Agent',
            paymentMethod: 'Cash',
            reservationType: 'DRAFT',
            status: 'Paid',
            statusValues: ['Paid', 'Unpaid'],
          },
          {
            invoiceId: 1682254737883,
            outletName: 'Outlet 1',
            bookingNumber: '1682254737883',
            guestName: 'Rajesh',
            date: '2021-05-21',
            time: '12:00 PM',
            totalDueAmount: 100,
            totalAmount: 1000,
            source: 'Agent',
            paymentMethod: 'Cash',
            reservationType: 'CONFIRMED',
            status: 'Paid',
            statusValues: ['Paid', 'Unpaid'],
          },
          {
            invoiceId: 1682254737883,
            outletName: 'Outlet 1',
            bookingNumber: '1682254737883',
            guestName: 'Rajesh',
            date: '2021-05-21',
            time: '12:00 PM',
            totalDueAmount: 100,
            totalAmount: 1000,
            source: 'Agent',
            paymentMethod: 'Cash',
            reservationType: 'DRAFT',
            status: 'Paid',
            statusValues: ['Paid', 'Unpaid'],
          },
        ];

        res.entityTypeCounts = {};
        res.entityStateCounts = {
          draft: 3,
          confirmed: 2,
          canceled: 0,
          waitListed: 0,
          noShow: 0,
          inSession: 0,
          completed: 0,
        };

        res.total = 5;

        return res;
      })
    );
  }
}
