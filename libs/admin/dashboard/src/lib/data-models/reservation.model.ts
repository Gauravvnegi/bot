import {
  GuestInformation,
  Instructions,
  ReservationInformation,
} from 'libs/admin/manage-reservation/src/lib/constants/form';
import { RoomReservationRes } from 'libs/admin/manage-reservation/src/lib/types/response.type';

export class QuickReservation {
  from: number;
  to: number;
  room: string;
  marketSegment: string;
  childCount: number;
  adultCount: number;
  source: string;
  sourceName: string;
  specialInstructions: string;

  deserialize(input: RoomReservationRes) {
    this.from = input.from;
    this.to = input.to;
    this.room = input.bookingItems[0].roomDetails.roomNumber;
    this.childCount = input.bookingItems[0].occupancyDetails.maxChildren;
    this.adultCount = input.bookingItems[0].occupancyDetails.maxAdult;
    this.source = input.source;
    this.sourceName = input.sourceName;
    this.specialInstructions = input.specialRequest;
    this.marketSegment = input.marketSegment;
    return this;
  }
}

export type GuestDetails = {
  id: string;
  guestName: string;
  phoneNumber: string;
  email: string;
};

type RoomInformation = {
  // For quick form
  roomTypeId?: string;
  ratePlan?: string;
  roomNumber?: string;
  adultCount?: number;
  childCount?: number;
  id?: string;
  roomNumbers: string[];
};
