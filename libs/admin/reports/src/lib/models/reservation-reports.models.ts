import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { ReportClass } from '../types/reports.types';
import {
  DefaultReservationReportData,
  NoShowReportData,
  ArrivalReportData,
  CancellationReportData,
  DepartureReportData,
} from '../types/reservation-reports.types';

class ReservationReport {
  defaultValue: DefaultReservationReportData;
  getDefaultValues(reservationData: ReservationResponseData) {
    this.defaultValue = {
      amountPaid: reservationData.totalPaidAmount,
      balance: reservationData.totalDueAmount,
      bookingAmount: reservationData.paymentSummary.totalAmount,
      bookingNo: reservationData.number,
      guestName:
        reservationData.guestDetails.primaryGuest.firstName +
        reservationData.guestDetails.primaryGuest.lastName,
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

export class ArrivalReport
  implements ReportClass<ArrivalReportData, ReservationResponseData> {
  records: ArrivalReportData[];
  deserialize(value: ReservationResponseData[]) {
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
        roomAndRoomType: `${reservationData.stayDetails.room.roomNumber} /
          ${reservationData.stayDetails.room.type}`,
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

export class DepartureReport
  implements ReportClass<DepartureReportData, ReservationResponseData> {
  records: DepartureReportData[];
  deserialize(value: ReservationResponseData[]) {
    return this;
  }
}
