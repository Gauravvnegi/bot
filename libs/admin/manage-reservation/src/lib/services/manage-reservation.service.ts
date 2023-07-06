import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import {
  RoomTypeListResponse,
} from 'libs/admin/room/src/lib/types/service-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationTableValue } from '../constants/reservation-table';
import { ReservationFormData } from '../types/forms.types';
import { QueryConfig } from '../types/reservation.type';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EntityTabGroup } from '../constants/reservation-table';

@Injectable()
export class ManageReservationService extends ApiService {
  public selectedOutlet = new BehaviorSubject<EntityTabGroup>(EntityTabGroup.HOTEL);

  reservationDate = new BehaviorSubject<Date>(null);

  setSelectedOutlet(value: EntityTabGroup) {
    this.selectedOutlet.next(value);
  }

  getSelectedOutlet(): Observable<EntityTabGroup> {
    return this.selectedOutlet.asObservable().pipe(distinctUntilChanged());
  }

  selectedTab = ReservationTableValue.ALL;

  getRoomTypeList(
    entityId: string,
    config?: QueryConfig
  ): Observable<RoomTypeListResponse> {
    return this.get(`/api/v1/entity/${entityId}/inventory${config?.params}`);
  }

  getPaymentMethod(entityId: string): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/configuration?configType=PAYMENT&status=ACTIVE`
    );
  }

  createReservation(entityId: string, data): Observable<any> {
    return this.post(
      `/api/v1/booking?bookingType=ROOM_TYPE&entityId=${entityId}`,
      data
    );
  }

  getOfferByRoomType(entityId: string, roomTypeId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/inventory/room/${roomTypeId}`);
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
    data
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}?bookingType=ROOM_TYPE&entityId=${entityId}`,
      data
    );
  }

  addGuest(data) {
    return this.post('api/v1/members?type=GUEST', data);
  }

  getSummaryData(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/booking/summary${config?.params}`);
  }

  getReservationItems<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`);
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
    reservationData.roomTypeId = formValue.roomInformation?.roomTypeId ?? '';
    reservationData.adultCount = formValue.roomInformation?.adultCount ?? 0;
    reservationData.childCount = formValue.roomInformation?.childCount ?? 0;
    reservationData.roomCount = formValue.roomInformation?.roomCount ?? 0;
    reservationData.from = formValue.reservationInformation.from ?? 0;
    reservationData.to = formValue.reservationInformation.to ?? 0;
    reservationData.reservationType =
      formValue.reservationInformation.reservationType ?? '';
    reservationData.source = formValue.reservationInformation.source ?? '';
    reservationData.sourceName =
      formValue.reservationInformation.sourceName ?? '';
    reservationData.marketSegment =
      formValue.reservationInformation.marketSegment ?? '';
    reservationData.address = {
      addressLine1: formValue.address.addressLine1 ?? '',
      city: formValue.address.city ?? '',
      state: formValue.address.state ?? '',
      countryCode: formValue.address.countryCode ?? '',
      postalCode: formValue.address.postalCode ?? '',
    };
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
          cancelled: 0,
          waitListed: 0,
          noShow: 0,
          checkedIn: 0,
          checkedOut: 0,
          inSession: 0,
          completed: 0,
        };

        res.total = 5;

        return res;
      })
    );
  }

  getOutletList(
    entityId,
    config: QueryConfig = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        res.records = [
          {
            id: 1,
            name: 'The Hilltop',
            type: 'HOTEL',
          },
          {
            id: 2,
            name: 'Restaurant',
            type: 'RESTAURANT',
          },
          {
            id: 3,
            name: 'Venue',
            type: 'VENUE',
          },
          {
            id: 3,
            name: 'Spa',
            type: 'SPA',
          },
        ];
        return res;
      })
    );
  }
}
