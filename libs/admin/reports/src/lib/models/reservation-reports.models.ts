import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
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

export class NoShowReport extends ReservationReport
  implements ReportClass<NoShowReportData, ReservationResponseData> {
  records: NoShowReportData[];

  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<NoShowReportData>();

    value.forEach((reservationData) => {
      this.records.push({
        ...this.getDefaultValues(reservationData),
        bookingNo: reservationData.number,
        dateOfArrival: reservationData.arrivalTime,
        dateOfNoShow: null,
        noShowCharges: null,
        noShowReason: '',
      });
    });

    return this;
  }
}

export class CancellationReport extends ReservationReport
  implements ReportClass<CancellationReportData, ReservationResponseData> {
  records: CancellationReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<CancellationReportData>();

    value.forEach((reservationData) => {
      this.records.push({
        ...this.getDefaultValues(reservationData),
        roomAndRoomType: `${reservationData?.stayDetails?.room.roomNumber} /
          ${reservationData?.stayDetails?.room.type}`,
        // is checkin and arrivalTime same??
        checkInDate: reservationData.arrivalTime,
        // is checkout and departureTime same??
        checkOutDate: reservationData.departureTime,
        noOfNights: null,
        cancelationDate: null,
        cancellationCharges: null,
        cancellationReason: '',
      });
    });
    return this;
  }
}

export class Arrival {
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

function getFormattedDate(time: number) {
  const currentDate = new Date(time);
  const monthAbbreviated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
  }).format(currentDate);
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();
  return `${monthAbbreviated} ${date}, ${year}`;
}
