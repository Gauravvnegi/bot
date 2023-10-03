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
  guestDetails: GuestDetails;

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
    this.guestDetails = {
      guestName:
        input.guest.firstName +
        ' ' +
        (input.guest?.lastName ? input.guest.lastName : ''),
      phoneNumber:
        input.guest.contactDetails?.cc +
        '' +
        input.guest?.contactDetails?.contactNumber,
      id: input.guest?.id ?? '',
      email: input.guest?.contactDetails?.emailId,
    };
    return this;
  }
}

export type GuestDetails = {
  id: string;
  guestName: string;
  phoneNumber: string;
  email: string;
};
