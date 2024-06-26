import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReservationTableValue } from '../constants/reservation-table';
import { RoomReservationFormData, SourceData } from '../types/forms.types';
import { ReservationForm, ReservationInformation } from '../constants/form';
import { Option, QueryConfig } from '@hospitality-bot/admin/shared';
import { AbstractControl } from '@angular/forms';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { RoomTypeOption } from '../constants/reservation';
import { ReservationCurrentStatus } from '../models/reservations.model';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { ManualOffer } from '../components/form-components/booking-summary/booking-summary.component';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}
  dateDifference = new BehaviorSubject(1);

  disableBtn: boolean = false;
  calendarView: boolean = false;

  getSummary = new BehaviorSubject(false);
  deductedAmount = new BehaviorSubject(0);
  isDataInitialized = new BehaviorSubject(false);
  reinitializeRooms = new BehaviorSubject(false);

  guestInformation: BehaviorSubject<Option> = new BehaviorSubject<Option>(null);
  offerType: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  currentJourneyStatus: BehaviorSubject<
    ReservationCurrentStatus
  > = new BehaviorSubject<ReservationCurrentStatus>(null);

  sourceData: BehaviorSubject<SourceData> = new BehaviorSubject<SourceData>(
    null
  );

  reservationDate = new BehaviorSubject<Date>(null);

  selectedTab = ReservationTableValue.ALL;
  enableAccordion: boolean = false;

  reservationForm = new BehaviorSubject<ReservationForm>(null);

  updateRateImprovement(control: AbstractControl) {
    if (control) control.patchValue(true, { emitEvent: false });
  }

  initSourceData(
    reservationInfo: ReservationInformation,
    sourceData: { agent: AgentTableResponse; company: CompanyResponseType }
  ) {
    this.sourceData.next({
      source: reservationInfo.source,
      sourceName: reservationInfo.sourceName,
      agent: sourceData?.agent ?? null,
      marketSegment: reservationInfo?.marketSegment,
      company: sourceData?.company ?? null,
    });
  }

  mapRoomReservationData(
    input: ReservationForm,
    id?: string,
    type: 'full' | 'quick' = 'full',
    totalAmount?: number,
    offerData?: ManualOffer
  ): RoomReservationFormData {
    const roomReservationData = new RoomReservationFormData();
    // Map Reservation Info
    roomReservationData.id = id ?? '';
    roomReservationData.from = input.reservationInformation?.from;
    roomReservationData.to = input.reservationInformation?.to;
    roomReservationData.reservationType =
      input.reservationInformation?.reservationType ?? 'CONFIRMED';
    roomReservationData.sourceName =
      (input.reservationInformation.source === 'OTA' &&
        input.reservationInformation.otaSourceName) ||
      (input.reservationInformation.source === 'AGENT' &&
        input.reservationInformation.agentSourceName) ||
      (input.reservationInformation.source === 'COMPANY' &&
        input.reservationInformation.companySourceName) ||
      input.reservationInformation.sourceName;

    input.reservationInformation?.sourceName ??
      input.reservationInformation?.agentSourceName ??
      input.reservationInformation?.otaSourceName;
    roomReservationData.source = input.reservationInformation?.source;
    roomReservationData.marketSegment =
      input.reservationInformation?.marketSegment;

    roomReservationData.printRate = input?.printRate;

    roomReservationData.paymentDetails = {
      paymentMethod: input?.paymentMethod?.paymentMethod ?? '',
      remarks: input?.paymentMethod?.paymentRemark ?? '',
      amount: input?.paymentMethod?.totalPaidAmount ?? 0,
      transactionId: input?.paymentMethod?.transactionId ?? '',
      cashierId: input?.paymentMethod?.cashierId ?? '',
    };
    roomReservationData.sessionType =
      input?.reservationInformation?.sessionType;
    roomReservationData.slotId = input?.reservationInformation?.slotId;
    if (type === 'full') {
      if (input?.paymentRule?.amountToPay && input.paymentRule.partialPayment)
        roomReservationData.paymentRule = {
          amount: input?.paymentRule?.amountToPay,
          type: 'FLAT',
          dueDate: input?.paymentRule?.makePaymentBefore,
          remarks: input?.paymentRule?.inclusionsAndTerms,
        };
      if (input.paymentRule.partialPayment === false)
        roomReservationData.paymentRule = {
          amount: totalAmount,
          type: 'FLAT',
          dueDate: input?.paymentRule?.makePaymentBefore,
          remarks: input?.paymentRule?.inclusionsAndTerms,
        };
    }

    roomReservationData.guestId = input.guestInformation?.guestDetails;
    roomReservationData.specialRequest = input.instructions.specialInstructions;

    roomReservationData.offer =
      offerData?.offerType && offerData?.offerType === 'MANUAL'
        ? offerData
        : {
            id: input.offerId ?? null,
          };

    // Map Booking Items
    if (input.roomInformation?.roomTypes) {
      roomReservationData.bookingItems = input.roomInformation.roomTypes.map(
        (roomType) => {
          const bookingItem: any = {
            roomDetails: {
              ratePlan: { id: roomType.ratePlanId },
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

          if (roomType?.id?.length) {
            bookingItem.id = roomType.id;
          }

          return bookingItem;
        }
      );
    } else if (type === 'quick') {
      roomReservationData.bookingItems[0] = {
        roomDetails: {
          ratePlan: { id: input.roomInformation?.ratePlanId },
          roomTypeId: input.roomInformation?.roomTypeId,
          roomCount: input.roomInformation?.roomNumbers?.length
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
      if (input.roomInformation?.id?.length)
        roomReservationData.bookingItems[0].id = input.roomInformation.id;
    } else {
      roomReservationData.bookingItems = [];
    }

    return roomReservationData;
  }

  setReservationRoomType(data: RoomTypeResponse | RoomTypeOption) {
    return 'name' in data
      ? {
          label: data.name,
          value: data.id,
          ratePlans: data?.ratePlans?.map((item) => ({
            label: item.label,
            value: item.id,
            isBase: item.isBase,
            sellingPrice: item?.sellingPrice,
          })),
          roomCount: 1,
          maxChildren: data.occupancyDetails?.maxChildren,
          maxAdult: data.occupancyDetails?.maxAdult,
          rooms:
            data?.rooms?.map((room) => ({
              label: room?.roomNumber,
              value: room?.roomNumber,
              roomNumber: room?.roomNumber,
            })) ?? [],
        }
      : data;
  }

  resetData() {
    this.currentJourneyStatus.next(null);
    this.reservationForm.next(null);
    this.getSummary.next(false);
    this.sourceData.next(null);
    this.disableBtn = false;
    this.dateDifference.next(1);
    this.guestInformation.next(null);
    this.enableAccordion = false;
    this.deductedAmount.next(0);
    this.isDataInitialized.next(false);
    this.reinitializeRooms.next(false);
    this.offerType.next(null);
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
