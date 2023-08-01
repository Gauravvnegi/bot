import { Injectable } from '@angular/core';
import { EntitySubType, EntityType } from '@hospitality-bot/admin/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReservationTableValue } from '../constants/reservation-table';
import { SelectedEntity } from '../types/reservation.type';
import { OutletFormData } from '../types/forms.types';
import { ReservationForm } from '../constants/form';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  outletIds = [];
  dateDifference = new BehaviorSubject(1);
  toDate: Date;
  fromDate: Date;

  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);
  getSelectedEntity(): Observable<SelectedEntity> {
    return this.selectedEntity.asObservable().pipe(distinctUntilChanged());
  }

  type: string;
  $entityTypeChange = new BehaviorSubject({ status: false, type: '' });
  $feedbackType = new BehaviorSubject('');

  reservationDate = new BehaviorSubject<Date>(null);
  reservationDateAndTime = new BehaviorSubject<number>(0);
  getReservationDateAndTime(): Observable<Date> {
    return this.reservationDate.asObservable();
  }
  selectedTab = ReservationTableValue.ALL;
  enableAccordion: boolean = false;

  //  Booking Summary Props
  price = new BehaviorSubject(0);
  discountedPrice = new BehaviorSubject(0);
  // roomType = new BehaviorSubject({roomTypeCount: 0, roomTypeName: ''});

  mapOutletReservationData(input: ReservationForm, outletType: string) {
    const reservationData = new OutletFormData();
    // Reservation Info
    reservationData.eventType = input.reservationInformation?.eventType ?? '';
    reservationData.from =
      input.reservationInformation?.dateAndTime ??
      input.reservationInformation?.from;
    reservationData.to =
      input.reservationInformation?.dateAndTime ??
      input.reservationInformation?.to;
    reservationData.reservationType =
      input.reservationInformation?.reservationType ??
      input.reservationInformation?.status;
    reservationData.sourceName = input.reservationInformation?.sourceName;
    reservationData.source = input.reservationInformation?.source;
    reservationData.marketSegment = input.reservationInformation?.marketSegment;

    // Booking/order/event info
    reservationData.adultCount =
      input.orderInformation?.numberOfAdults ??
      input.bookingInformation?.numberOfAdults;
    reservationData.items =
      input.bookingInformation?.spaItems.map((item) => ({
        itemId: item.serviceName,
        unit: item?.quantity ?? 1,
        amount: item.amount,
      })) ??
      input.orderInformation?.menuItems.map((item) => ({
        itemId: item.menuItems,
        unit: item?.quantity ?? 1,
        amount: item.amount,
      })) ??
      input.eventInformation?.venueInfo.map((item) => ({
        itemId: item.description,
        unit: item?.quantity ?? 1,
        amount: item.amount,
      }));

    // Payment Info
    reservationData.paymentMethod = input.paymentMethod?.paymentMethod ?? '';
    reservationData.paymentRemark = input.paymentMethod?.paymentRemark ?? '';
    reservationData.totalPaidAmount = input.paymentMethod?.totalPaidAmount ?? 0;

    reservationData.guestId = input.guestInformation?.guestDetails;
    reservationData.offerId = input?.offerId ?? '';
    reservationData.outletType = outletType;

    return reservationData;
  }
}
