import {
  ReservationResponse,
  ReservationResponseData,
} from 'libs/admin/shared/src/lib/types/response';
import { ReportClass, RowStyles } from '../types/reports.types';
import {
  ReservationReportData,
  NoShowReportData,
  ArrivalReportData,
  CancellationReportData,
  DepartureReportData,
} from '../types/reservation-reports.types';

/**
 * @class Default Reservation Report class
 * Will be extended in every reservation report
 */
class ReservationReport {
  defaultValue: ReservationReportData;
  getDefaultValues(reservationData: ReservationResponseData) {
    this.defaultValue = {
      id: reservationData.id,
      amountPaid: reservationData.totalPaidAmount,
      balance: reservationData.totalDueAmount,
      bookingAmount: reservationData.paymentSummary?.totalAmount,
      bookingNo: reservationData.number,
      guestName:
        reservationData?.guestDetails?.primaryGuest.firstName +
        ' ' +
        reservationData?.guestDetails?.primaryGuest.lastName,
      otherCharges: null,
    };

    return this.defaultValue;
  }
}

export class NoShows {
  id?: string;
  bookingNumber: string;
  dateOfArrival: string;
  noShowOn: string;
  guestName: string;
  bookingAmount: string;
  noShowCharge: string;
  noShowReason: string;
  otherCharge: string;
  amountPaid: string;
  balance: string;
  deserialize(value: ReservationResponse) {
    this.id = value?.id;
    this.bookingNumber = value?.reservationNumber;
    this.dateOfArrival = getFormattedDate(value?.from);
    this.noShowOn = getFormattedDate(value?.from);
    this.guestName = `${value?.guest.firstName ?? ''} ${
      value?.guest?.lastName ?? ''
    }`.trim();
    this.bookingAmount = `${value?.pricingDetails?.totalAmount}`;
    this.noShowCharge = null;
    this.noShowReason = null;
    this.otherCharge = null;
    this.amountPaid = `${value?.pricingDetails?.totalPaidAmount}`;
    this.balance = `${value?.pricingDetails?.totalDueAmount}`;
    return this;
  }
}

export class NoShowReport extends ReservationReport
  implements ReportClass<NoShowReportData, ReservationResponse> {
  records: NoShowReportData[];

  deserialize(value: ReservationResponse[]) {
    this.records = new Array<NoShowReportData>();
    value.forEach((reservationData) => {
      this.records.push(new NoShows().deserialize(reservationData));
    });
    return this;
  }
}

export class Cancellation extends NoShows {
  roomType: string;
  checkIn: string;
  checkOut: string;
  night: string;
  cancelledOn: string;
  cancellationCharge: string;
  cancellationReason: string;

  deserialize(value: ReservationResponse): this {
    super.deserialize(value);
    const roomDetails = value.bookingItems[0];
    this.roomType = `${roomDetails?.roomDetails?.roomNumber}/${roomDetails?.roomDetails?.roomTypeLabel}`;
    this.checkIn = getFormattedDate(value?.from);
    this.checkOut = getFormattedDate(value?.to);
    this.night = `${calculateNumberOfNights(value.from, value.to)}`;
    this.cancelledOn = getFormattedDate(value?.from);
    this.cancellationCharge = null;
    this.cancellationReason = null;
    return this;
  }
}

export class CancellationReport extends ReservationReport
  implements ReportClass<CancellationReportData, ReservationResponse> {
  records: CancellationReportData[];
  deserialize(value: ReservationResponse[]) {
    this.records = new Array<CancellationReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Cancellation().deserialize(reservationData));
    });
    return this;
  }
}

export class Arrival {
  id?: string;
  bookingNo: string;
  guestName: string;
  bookingAmount: number;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  arrivalTime: string;
  remark: string;
  deserialize(input: ReservationResponseData) {
    this.id = input.id;
    (this.bookingAmount = input.paymentSummary.totalAmount),
      (this.bookingNo = input.number),
      (this.guestName =
        input.guestDetails.primaryGuest.firstName +
        ' ' +
        input.guestDetails.primaryGuest.lastName);

    this.roomType = `${input.stayDetails.room.roomNumber}/${input.stayDetails.room.type}`; // need to ask which key should be mapped
    this.checkIn = input?.arrivalTime
      ? getFormattedDate(input.arrivalTime)
      : '';
    this.checkOut = input?.departureTime
      ? getFormattedDate(input.departureTime)
      : '';
    this.status = input?.pmsStatus ?? '';
    this.arrivalTime = input?.arrivalTime
      ? getFormattedDate(input.arrivalTime)
      : '';
    this.remark = input?.specialRequest ?? ''; // need to verify from backend
    return this;
  }
}

export class ArrivalReport extends ReservationReport
  implements ReportClass<ArrivalReportData, ReservationResponseData> {
  records: ArrivalReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ArrivalReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Arrival().deserialize(reservationData));
    });
    return this;
  }
}

export class Departure extends Arrival {
  deserialize(input: ReservationResponseData) {
    super.deserialize(input);
    return this;
  }
}

export class DepartureReport extends ReservationReport
  implements ReportClass<DepartureReportData, ReservationResponseData> {
  records: DepartureReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<DepartureReportData>();
    value.forEach((reservationData) => {
      this.records.push(new Departure().deserialize(reservationData));
    });
    return this;
  }
}

export function getFormattedDate(time: number) {
  const currentDate = new Date(time);
  const monthAbbreviated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(currentDate);
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${monthAbbreviated} ${date}, ${year}`;
}

function calculateNumberOfNights(
  checkinTimestamp: number,
  checkoutTimestamp: number
) {
  const checkinDate = new Date(checkinTimestamp);
  const checkoutDate = new Date(checkoutTimestamp);
  const differenceInMilliseconds =
    checkoutDate.getTime() - checkinDate.getTime();
  const differenceInDays = differenceInMilliseconds / 86400000;
  const numberOfNights = Math.ceil(differenceInDays);
  return numberOfNights;
}
