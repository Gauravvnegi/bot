export type RoomReservationResponse = {
  id: string;
  from: number;
  to: number;
  totalAmount: number;
  source: string;
  reservationType: string;
  sourceName: string;
  marketSegment: string;
  totalPaidAmount: number;
  totalDueAmount: number;
  reservationNumber: string;
  status: string;
  guest: Guest;
  created: number;
  offerAmount: number;
  nextStates: string[];
  bookingItems: BookingItem[];
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  dateOfBirth: number;
  age: number;
  type: string;
  isVerified: boolean;
  status: boolean;
  code: string;
  created: number;
  updated: number;
  gender: string;
};

export type ContactDetails = {
  cc: string;
  contactNumber: string;
  emailId: string;
};

export type BookingItem = {
  roomTypeId: string;
  ratePlanId: string;
  roomCount: number;
  adultCount: number;
  childCount: number;
  roomRatePlanType: string;
  roomRatePlanPrice: number;
  totalAmount: number;
  totalDueAmount: number;
  id?: string;
  offerAmount: number;
  taxPrice: number;
  roomTypeBasePrice: number;
  tableNumberOrRoomNumber: string[];
};

export type RoomSummaryResponse = {
  from: number;
  to: number;
  roomCount: number;
  adultCount: number;
  childCount: number;
  location: string;
  totalAmount: number;
  bookingItems: BookingItem[];
};
