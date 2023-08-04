import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReservationTableValue } from '../constants/reservation-table';
import { SelectedEntity } from '../types/reservation.type';
import { OutletFormData, RoomReservationFormData } from '../types/forms.types';
import { ReservationForm } from '../constants/form';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  outletIds = [];
  dateDifference = new BehaviorSubject(1);
  toDate: Date;
  fromDate: Date;

  guestId = new BehaviorSubject<string>('');

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

  mapRoomReservationData(input: ReservationForm): RoomReservationFormData {
    const roomReservationData = new RoomReservationFormData();
  
    // Map Reservation Info
    roomReservationData.from =
      input.reservationInformation?.dateAndTime ?? input.reservationInformation?.from;
    roomReservationData.to =
      input.reservationInformation?.dateAndTime ?? input.reservationInformation?.to;
    roomReservationData.reservationType =
      input.reservationInformation?.reservationType ?? input.reservationInformation?.status;
    roomReservationData.sourceName = input.reservationInformation?.sourceName;
    roomReservationData.source = input.reservationInformation?.source;
    roomReservationData.marketSegment = input.reservationInformation?.marketSegment;
    roomReservationData.paymentMethod = input.paymentMethod?.paymentMethod ?? '';
    roomReservationData.paymentRemark = input.paymentMethod?.paymentRemark ?? '';
    roomReservationData.guestId = input.guestInformation?.guestDetails;
  
    // Map Booking Items
    if (input.roomInformation?.roomTypes) {
      roomReservationData.bookingItems = input.roomInformation.roomTypes.map(
        (roomType) => ({
          roomDetails: {
            ratePlan: { id: roomType.ratePlanId },
            roomTypeId: roomType.roomTypeId,
            roomCount: roomType.roomCount,
          },
          occupancyDetails: {
            maxChildren: roomType.childCount,
            maxAdult: roomType.adultCount,
          },
        })
      );
    } else {
      roomReservationData.bookingItems = [];
    }
  
    return roomReservationData;
  }
  

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
    reservationData.status = input.reservationInformation?.status;
    reservationData.reservationType = input.reservationInformation?.status;

    // Booking/order/event info
    reservationData.adultCount =
      input.orderInformation?.numberOfAdults ??
      input.bookingInformation?.numberOfAdults;
    reservationData.items =
      input.bookingInformation?.spaItems.map((item) => ({
        itemId: item.serviceName,
        unit: item?.unit ?? 1,
        amount: item.amount,
      })) ??
      input.orderInformation?.menuItems.map((item) => ({
        itemId: item.menuItems,
        unit: item?.unit ?? 1,
        amount: item.amount,
      })) ??
      input.eventInformation?.venueInfo.map((item) => ({
        itemId: item.description,
        unit: item?.unit ?? 1,
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
