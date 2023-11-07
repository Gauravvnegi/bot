import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import {
  ReservationActivityReportData,
  ReservationCreatedReportData,
} from '../types/activity-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class ReservationCreatedReport
  implements
    ReportClass<ReservationCreatedReportData, ReservationResponseData> {
  records: ReservationCreatedReportData[];
  deserialize(value: ReservationResponseData[]) {
    this.records = new Array<ReservationCreatedReportData>();
    if (!value) return this;

    value.forEach((data) => {
      this.records.push({
        id: data.id,
        bookingNo: data.number,
        createdOn: getFormattedDate(data.created),
        roomType: data.stayDetails.room.type,
        primaryGuest: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
        arrival: getFormattedDate(data.stayDetails.arrivalTime),
        departure: getFormattedDate(data.stayDetails.departureTime),
        nights: data.guestDetails.primaryGuest.totalNights,
        amount: data.paymentSummary.totalAmount,
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

    value.forEach((data) => {
      this.records.push({
        id: data.id,
        bookingNo: data.number,
        roomType: data.stayDetails.room.type,
        primaryGuest: `${data.guestDetails.primaryGuest.firstName} ${data.guestDetails.primaryGuest.lastName}`,
        sharers: `${data.guestDetails.sharerGuests.length}`,
        arrival: getFormattedDate(data.stayDetails.arrivalTime),
        departure: getFormattedDate(data.stayDetails.departureTime),
        pax: `${data.stayDetails.adultsCount} Adults, ${data.stayDetails.kidsCount} Kids`,
        rateOrPackage: undefined, //to be added in response
        amount: data.paymentSummary.totalAmount,
      });
    });

    return this;
  }
}