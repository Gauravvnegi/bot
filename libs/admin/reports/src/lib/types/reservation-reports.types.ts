export type DefaultReservationReportData = {
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  otherCharges: number;
  amountPaid: number;
  balance: number;
};

export type NoShowReportData = DefaultReservationReportData & {
  dateOfArrival: number;
  dateOfNoShow: number;
  noShowCharges: number;
  noShowReason: string;
};

export type ArrivalReportData = DefaultReservationReportData & {};

export type DepartureReportData = DefaultReservationReportData & {};

export type CancellationReportData = DefaultReservationReportData & {
  roomAndRoomType: string;
  checkInDate: number;
  checkOutDate: number;
  noOfNights: number;
  cancelationDate: number;
  cancellationCharges: number;
  cancellationReason: string;
};
