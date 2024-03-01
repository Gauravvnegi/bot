import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import {
  ReservationActivityReportData,
  ReservationCreatedReportData,
} from '../types/activity-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';
import {
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';

export class ReservationCreatedReport
  implements
    ReportClass<ReservationCreatedReportData, ReservationResponseData> {
  records: ReservationCreatedReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ReservationCreatedReportData>();
    value &&
      value.forEach((data) => {
        this.records.push({
          reservationId: data.id,
          bookingNo: data.number,
          createdOn: getFormattedDate(data.created),
          roomType: data.stayDetails.room.type,
          primaryGuest: getFullName(
            data.guestDetails.primaryGuest.firstName,
            data.guestDetails.primaryGuest.lastName
          ),
          arrival: getFormattedDate(data.stayDetails.arrivalTime),
          departure: getFormattedDate(data.stayDetails.departureTime),
          nights: data.nightCount,
          amount: toCurrency(data.paymentSummary.totalAmount),
        });
      });

    return this;
  }
}

export class ReservationActivityReport
  implements
    ReportClass<ReservationActivityReportData, ReservationResponseData> {
  records: ReservationActivityReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ReservationActivityReportData>();

    value &&
      value.forEach((data) => {
        this.records.push({
          reservationId: data.id,
          bookingNo: data.number,
          roomType: data.stayDetails.room.type,
          primaryGuest: getFullName(
            data.guestDetails.primaryGuest.firstName,
            data.guestDetails.primaryGuest.lastName
          ),
          sharers: `${data.guestDetails.sharerGuests.length}`,
          arrival: getFormattedDate(data.stayDetails.arrivalTime),
          departure: getFormattedDate(data.stayDetails.departureTime),
          pax: `${data.stayDetails.adultsCount} Adults, ${data.stayDetails.kidsCount} Kids`,
          rateOrPackage: undefined, //to be added in response
          amount: toCurrency(data.paymentSummary.totalAmount),
        });
      });

    return this;
  }
}
