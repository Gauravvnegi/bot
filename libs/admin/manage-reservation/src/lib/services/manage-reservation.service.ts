import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SearchResultResponse } from 'libs/admin/library/src/lib/types/response';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationTableValue } from '../constants/reservation-table';
import { ReservationFormData } from '../types/forms.types';
import { QueryConfig } from '../types/reservation.type';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EntityTabGroup } from '../constants/reservation-table';

@Injectable()
export class ManageReservationService extends ApiService {
  public selectedOutlet = new BehaviorSubject<EntityTabGroup>(
    EntityTabGroup.HOTEL
  );
  getSelectedOutlet(): Observable<EntityTabGroup> {
    return this.selectedOutlet.asObservable().pipe(distinctUntilChanged());
  }

  reservationDate = new BehaviorSubject<Date>(null);

  selectedTab = ReservationTableValue.ALL;

  getRoomTypeList(
    hotelId: string,
    config?: QueryConfig
  ): Observable<RoomTypeListResponse> {
    return this.get(`/api/v1/entity/${hotelId}/inventory${config?.params}`);
  }

  getPaymentMethod(hotelId: string): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/configuration?configType=PAYMENT&status=ACTIVE`
    );
  }

  createReservation(hotelId: string, data): Observable<any> {
    return this.post(
      `/api/v1/booking?bookingType=ROOM_TYPE&entityId=${hotelId}`,
      data
    );
  }

  getOfferByRoomType(hotelId: string, roomTypeId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/inventory/room/${roomTypeId}`);
  }

  getReservationDataById(bookingId: string, hotelId: string): Observable<any> {
    return this.get(`/api/v1/booking/${bookingId}?entityId=${hotelId}`);
  }

  updateReservation<T, K>(
    hotelId: string,
    reservationId: string,
    data: any
  ): Observable<K> {
    return this.put(
      `/api/v1/booking/${reservationId}?bookingType=ROOM_TYPE&entityId=${hotelId}`,
      data
    );
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(
    hotelId: string,
    config?: QueryConfig
  ): Observable<SearchResultResponse> {
    return this.get(
      `/api/v1/entity/${hotelId}/library/search${config?.params ?? ''}`
    );
  }

  updateBookingStatus(
    bookingId: string,
    hotelId: string,
    data
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}?bookingType=ROOM_TYPE&entityId=${hotelId}`,
      data
    );
  }

  addGuest(data) {
    return this.post('api/v1/guest', data);
  }

  getSummaryData(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/booking/summary${config?.params}`).pipe(
      map((res) => ({
        ...res,
        roomNumbers: [
          { label: '200', value: '200' },
          { label: '201', value: '201' },
          { label: '202', value: '202' },
          { label: '203', value: '203' },
          { label: '204', value: '204' },
        ],
      }))
    );
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
    hotelId,
    config: QueryConfig = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
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
    hotelId,
    config: QueryConfig = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
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
            name: 'Restaurant and Bar',
            type: 'RESTAURANT_AND_BAR',
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
