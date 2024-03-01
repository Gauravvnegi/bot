export type ReservationCreatedReportData = {
  reservationId?: string;
  bookingNo: string;
  createdOn: string;
  roomType: string;
  primaryGuest: string;
  arrival: string;
  departure: string;
  nights: number;
  amount: string;
};

export type ReservationActivityReportData = {
  reservationId?: string;
  bookingNo: string;
  roomType: string;
  primaryGuest: string;
  sharers: string;
  arrival: string;
  departure: string;
  pax: string;
  rateOrPackage: string;
  amount: string;
};
