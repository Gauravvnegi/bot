import {
  CompanyContributionsReportData,
  CompanyContributionsReportResponse,
  NoShowSummaryReportData,
  NoShowSummaryReportResponse,
} from '../types/analytics-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class CompanyContributionsReport
  implements
    ReportClass<
      CompanyContributionsReportData,
      CompanyContributionsReportResponse
    > {
  records: CompanyContributionsReportData[];

  deserialize(value: CompanyContributionsReportResponse[]) {
    this.records = new Array<CompanyContributionsReportData>();

    value.forEach((reservationData: CompanyContributionsReportResponse) => {
      this.records.push({});
    });
    return this;
  }
}

export class NoShowSummaryReport
  implements ReportClass<NoShowSummaryReportData, NoShowSummaryReportResponse> {
  records: NoShowSummaryReportData[];

  deserialize(value: NoShowSummaryReportResponse[]) {
    this.records = new Array<NoShowSummaryReportData>();
    value.forEach((reservationData: NoShowSummaryReportResponse) => {
      this.records.push({
        createdOn: getFormattedDate(reservationData?.created),
        bookingNo: reservationData?.reservationNumber,
        guestName:
          reservationData?.guest?.firstName +
          ' ' +
          reservationData?.guest?.lastName,
        pax: reservationData?.bookingItems[0]?.occupancyDetails.maxAdult,
        rooms: reservationData?.bookingItems[0]?.roomDetails.roomNumber,
        roomType: reservationData?.bookingItems[0]?.roomDetails.roomTypeLabel,
        company: reservationData?.guest?.company?.firstName,
        status: reservationData?.status,
        checkIn: getFormattedDate(reservationData?.from),
        checkOut: getFormattedDate(reservationData?.to),
        createdBy:
          reservationData?.guest?.firstName +
          ' ' +
          reservationData?.guest?.lastName,
      });
    });
    return this;
  }
}
