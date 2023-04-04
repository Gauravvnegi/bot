import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable, ObservedValuesFromArray } from 'rxjs';
import { ReservationTableValue } from '../constants/reservation-table';
import { QueryConfig } from '../types/reservation.type';
import { map } from 'rxjs/operators';
import { APIManipulator } from '../models/dummy.model';
import {
  RoomListResponse,
  RoomTypeListResponse,
} from 'libs/admin/room/src/lib/types/service-response';
import { ReservationFormData } from '../types/forms.types';

@Injectable()
export class ManageReservationService extends ApiService {
  selectedTable = new BehaviorSubject<ReservationTableValue>(
    ReservationTableValue.ALL
  );

  getRoomTypeList<T extends RoomTypeListResponse | RoomListResponse>(
    hotelId: string,
    config?: QueryConfig
  ): Observable<T> {
    return this.get(`/api/v1/entity/${hotelId}/inventory${config?.params}`);
  }
  getPaymentMethod(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/configuration?configType=ALL`);
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

  getSummaryData(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/booking/summary${config?.params}`);
  }

  getReservationItems<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`);
  }

  getReservationItemsByCategory<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/booking${config?.params}`);
  }

  exportCSV(hotelId: string, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/library/export${config?.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }

  mapReservationData(formValue) {
    const reservationData = new ReservationFormData();
    reservationData.firstName = formValue.guestInformation.firstName ?? '';
    reservationData.lastName = formValue.guestInformation.lastName ?? '';
    reservationData.email = formValue.guestInformation.email ?? '';
    reservationData.contact = {
      countryCode: formValue?.guestInformation?.countryCode ?? '',
      phoneNumber: formValue?.guestInformation?.phoneNumber ?? '',
    };
    reservationData.roomTypeId = formValue.roomInformation[0]?.roomTypeId ?? '';
    reservationData.adultCount = formValue.roomInformation[0]?.adultCount ?? 0;
    reservationData.childCount = formValue.roomInformation[0]?.childCount ?? 0;
    reservationData.roomCount = formValue.roomInformation[0]?.roomCount ?? 0;
    reservationData.from = formValue.bookingInformation.from ?? 0;
    reservationData.to = formValue.bookingInformation.to ?? 0;
    reservationData.reservationType =
      formValue.bookingInformation.reservationType ?? '';
    reservationData.source = formValue.bookingInformation.source ?? '';
    reservationData.sourceName = formValue.bookingInformation.sourceName ?? '';
    reservationData.marketSegment =
      formValue.bookingInformation.marketSegment ?? '';
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
}
