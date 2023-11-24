import {
  businessAnalysisReportRows,
  marketSegmentReportRows,
} from '../constant/analytics-reports.const';
import {
  BusinessAnalysisReportData,
  BusinessAnalysisReportResponse,
  CompanyContributionsReportData,
  CompanyContributionsReportResponse,
  MarketSegmentReportData,
  MarketSegmentReportResponse,
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

export class BusinessAnalysisReport
  implements
    ReportClass<BusinessAnalysisReportData, BusinessAnalysisReportResponse> {
  records: BusinessAnalysisReportData[];

  deserialize(value: BusinessAnalysisReportResponse[]) {
    this.records = new Array<BusinessAnalysisReportData>();
   value && businessAnalysisReportRows.forEach((row) => {
      if (value.hasOwnProperty(row.label)) {
        this.records.push({
          marketSegment: row.name,
          nights: value[row.label].nights,
          occupancy: value[row.label].occupancyPercent,
          pax: value[row.label].pax,
          roomRevenue: value[row.label].roomRevenue,
          revenue: value[row.label].revenue,
          arrOrAgr: value[row.label].arr,
          arp: value[row.label].arp,
        });
      } else {
        this.records.push({
          marketSegment: row.name,
          nights: undefined,
          occupancy: undefined,
          pax: undefined,
          roomRevenue: undefined,
          revenue: undefined,
          arrOrAgr: undefined,
          arp: undefined,
  
        });
      }
    });

    return this;
  }
}

//marketSegmentReport
export class MarketSegmentReport
  implements ReportClass<MarketSegmentReportData, MarketSegmentReportResponse> {
  records: MarketSegmentReportData[];
  deserialize(value: MarketSegmentReportResponse) {
    this.records = new Array<MarketSegmentReportData>();

    value && marketSegmentReportRows.forEach((row) => {
      if (value.hasOwnProperty(row.label)) {
        this.records.push({
          marketSegment: row.name,
          nights: value[row.label].nights,
          occupancy: value[row.label].occupancyPercent,
          pax: value[row.label].pax,
          roomRevenue: value[row.label].roomRevenue,
          revenue: value[row.label].revenue,
          arrOrAgr: value[row.label].arr,
          arp: value[row.label].arp,
        });
      } else {
        this.records.push({
          marketSegment: row.name,
          nights: undefined,
          occupancy: undefined,
          pax: undefined,
          roomRevenue: undefined,
          revenue: undefined,
          arrOrAgr: undefined,
          arp: undefined,
        });
      }
    });

    return this;
  }
}
