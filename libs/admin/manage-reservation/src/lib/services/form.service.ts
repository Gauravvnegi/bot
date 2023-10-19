import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReservationTableValue } from '../constants/reservation-table';
import { SelectedEntity } from '../types/reservation.type';
import {
  OutletFormData,
  RoomReservationFormData,
  SourceData,
} from '../types/forms.types';
import { ReservationForm } from '../constants/form';
import { ManageReservationService } from './manage-reservation.service';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(public manageReservationService: ManageReservationService) {}
  dateDifference = new BehaviorSubject(1);

  disableBtn: boolean = false;
  calendarView: boolean = false;
  getSummary = new Subject<void>();
  deductedAmount = new BehaviorSubject(0);

  guestInformation: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  sourceData: BehaviorSubject<SourceData> = new BehaviorSubject<SourceData>(
    null
  );

  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);

  getSelectedEntity(): Observable<SelectedEntity> {
    return this.selectedEntity.asObservable().pipe(distinctUntilChanged());
  }

  reservationDate = new BehaviorSubject<Date>(null);
  reservationDateAndTime = new BehaviorSubject<number>(0);
  getReservationDateAndTime(): Observable<Date> {
    return this.reservationDate.asObservable();
  }
  selectedTab = ReservationTableValue.ALL;
  enableAccordion: boolean = false;

  reservationForm = new BehaviorSubject<ReservationForm>(null);

  mapRoomReservationData(
    input: ReservationForm,
    id?: string,
    type: 'full' | 'quick' = 'full'
  ): RoomReservationFormData {
    const roomReservationData = new RoomReservationFormData();
    // Map Reservation Info
    roomReservationData.id = id ?? '';
    roomReservationData.from = input.reservationInformation?.from;
    roomReservationData.to = input.reservationInformation?.to;
    roomReservationData.reservationType =
      input.reservationInformation?.reservationType ?? 'CONFIRMED';
    roomReservationData.sourceName = input.reservationInformation?.sourceName;
    roomReservationData.source = input.reservationInformation?.source;
    roomReservationData.marketSegment =
      input.reservationInformation?.marketSegment;

    roomReservationData.paymentDetails = {
      paymentMethod: input?.paymentMethod?.paymentMethod ?? '',
      remarks: input?.paymentMethod?.paymentRemark ?? '',
      amount: input?.paymentMethod?.totalPaidAmount ?? 0,
      transactionId: input?.paymentMethod?.transactionId ?? '',
    };

    roomReservationData.guestId = input.guestInformation?.guestDetails;
    roomReservationData.specialRequest = input.instructions.specialInstructions;
    roomReservationData.offer = {
      id: input.offerId ?? null,
    };

    // Map Booking Items
    if (input.roomInformation?.roomTypes) {
      roomReservationData.bookingItems = input.roomInformation.roomTypes.map(
        (roomType) => {
          const bookingItem: any = {
            roomDetails: {
              ratePlan: { id: roomType.ratePlan },
              roomTypeId: roomType.roomTypeId,
              roomCount: roomType?.roomCount ? roomType.roomCount : 1,
              roomNumbers: roomType?.roomNumbers ? roomType?.roomNumbers : [],
            },
            occupancyDetails: {
              maxChildren: roomType.childCount,
              maxAdult: roomType.adultCount,
            },
          };
          if (id) {
            bookingItem.roomDetails.roomNumber = roomType?.roomNumber
              ? roomType?.roomNumber
              : '';
          }

          if (roomType.id.length) {
            bookingItem.id = roomType.id;
          }

          return bookingItem;
        }
      );
    } else if (type === 'quick') {
      roomReservationData.bookingItems[0] = {
        roomDetails: {
          ratePlan: { id: input.roomInformation?.ratePlan },
          roomTypeId: input.roomInformation?.roomTypeId,
          roomCount: input.roomInformation?.roomNumbers
            ? input.roomInformation.roomNumbers.length
            : 1,
          roomNumbers: input.roomInformation?.roomNumbers
            ? input.roomInformation?.roomNumbers
            : [],
          roomNumber: input.roomInformation?.roomNumber ?? '',
        },
        occupancyDetails: {
          maxChildren: input.roomInformation?.childCount,
          maxAdult: input.roomInformation?.adultCount,
        },
      };
    } else {
      roomReservationData.bookingItems = [];
    }

    return roomReservationData;
  }

  mapOutletReservationData(
    input: ReservationForm,
    outletType: string,
    id?: string
  ) {
    const reservationData = new OutletFormData();
    // Reservation Info
    reservationData.id = id ?? '';
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
    reservationData.occupancyDetails = {
      maxAdult:
        input.orderInformation?.numberOfAdults ??
        input.bookingInformation?.numberOfAdults,
    };
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
    reservationData.pricingDetails = {
      totalPaidAmount: input.paymentMethod?.totalPaidAmount ?? 0,
    };

    reservationData.guestId = input.guestInformation?.guestDetails;
    reservationData.offerId = input?.offerId ?? '';
    reservationData.outletType = outletType;

    reservationData.specialRequest =
      outletType === 'RESTAURANT'
        ? input.orderInformation.kotInstructions
        : input.instructions?.specialInstructions;

    return reservationData;
  }

  resetData() {
    this.reservationForm.next(null);
    this.sourceData.next(null);
    this.disableBtn = false;
    this.dateDifference.next(1);
    this.guestInformation.next(null);
    this.enableAccordion = false;
    this.reservationForm.next(null);
    this.deductedAmount.next(0);
  }
}

export type GetRoomsConfig = {
  entityId: string;
  config: QueryConfig;
  type: 'string' | 'array';
  roomControl: AbstractControl;
  roomNumbersControl?: AbstractControl;
  defaultRoomNumbers?: string[];
};
