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
import { GuestInfo } from '../models/reservations.model';
import { ManageReservationService } from './manage-reservation.service';
import { Option, QueryConfig } from '@hospitality-bot/admin/shared';
import { RoomsByRoomType } from 'libs/admin/room/src/lib/types/service-response';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(public manageReservationService: ManageReservationService) {}
  dateDifference = new BehaviorSubject(1);

  disableBtn: boolean = false;

  getSummary = new Subject<void>();

  guestInformation: BehaviorSubject<GuestInfo> = new BehaviorSubject<GuestInfo>(
    null
  );

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
    id?: string
  ): RoomReservationFormData {
    const roomReservationData = new RoomReservationFormData();
    // Map Reservation Info
    roomReservationData.id = id ?? '';
    roomReservationData.from = input.reservationInformation?.from;
    roomReservationData.to = input.reservationInformation?.to;
    roomReservationData.reservationType =
      input.reservationInformation?.reservationType;
    roomReservationData.sourceName = input.reservationInformation?.sourceName;
    roomReservationData.source = input.reservationInformation?.source;
    roomReservationData.marketSegment =
      input.reservationInformation?.marketSegment;

    roomReservationData.paymentDetails.paymentMethod =
      input.paymentMethod?.paymentMethod ?? '';
    roomReservationData.paymentDetails.remarks =
      input.paymentMethod?.paymentRemark ?? '';
    roomReservationData.paymentDetails.amount =
      input.paymentMethod?.totalPaidAmount ?? 0;
    roomReservationData.paymentDetails.transactionId =
      input.paymentMethod.transactionId;
      
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
              roomCount: roomType.roomCount,
              roomNumbers: roomType?.roomNumbers ? roomType?.roomNumbers : [],
              roomNumber: roomType?.roomNumbers ? roomType?.roomNumbers[0] : '',
            },
            occupancyDetails: {
              maxChildren: roomType.childCount,
              maxAdult: roomType.adultCount,
            },
          };

          if (roomType.id.length) {
            bookingItem.id = roomType.id;
          }

          return bookingItem;
        }
      );
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

  getRooms(
    entityId: string,
    config: QueryConfig,
    roomNumbersControl: AbstractControl,
    roomNumbers?: AbstractControl,
    defaultRoomNumbers?: string[]
  ) {
    this.manageReservationService
      .getRoomNumber(entityId, config)
      .subscribe((res) => {
        const roomNumberOptions = res.rooms
          .filter((room: RoomsByRoomType) => room.roomNumber.length)
          .map((room: RoomsByRoomType) => ({
            label: room.roomNumber,
            value: room.roomNumber,
          }));
        // this.fields[3].loading[index] = false;

        // Check if the roomNumber control has the room number in roomNumberOptions
        if (roomNumbers && roomNumbers.value && !defaultRoomNumbers) {
          const roomNumbersValue = roomNumbers.value;
          // Filter the roomNumbersValue to keep only those values that exist in roomNumberOptions
          const filteredRoomNumbers = roomNumbersValue.filter((value: string) =>
            roomNumberOptions.some((option: Option) => option.value === value)
          );

          roomNumbers.setValue(filteredRoomNumbers);
        }

        // Patch the roomNumbers when the room number options are initialized
        if (defaultRoomNumbers.length) {
          roomNumbers.setValue(defaultRoomNumbers);
        }

        roomNumbersControl.patchValue(roomNumberOptions, { emitEvent: false });
      });
  }

  resetData() {
    this.reservationForm.next(null);
    this.sourceData.next(null);
    this.disableBtn = false;
  }
}
