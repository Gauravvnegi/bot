export type ReservationCreatedReportData = {
  id?: string;
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
  id?: string;
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
