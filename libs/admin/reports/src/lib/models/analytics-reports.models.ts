import {
  convertToNormalCase,
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  BusinessAnalysisReportData,
  BusinessAnalysisReportResponse,
  CompanyContributionsReportData,
  CompanyContributionsReportResponse,
  MarketSegmentReportData,
  MarketSegmentReportResponse,
  NoShowSummaryReportData,
  NoShowSummaryReportResponse,
  OccupancyAnalysisReportData,
  OccupancyAnalysisReportResponse,
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

export class OccupancyAnalysisReport
  implements
    ReportClass<OccupancyAnalysisReportData, OccupancyAnalysisReportResponse> {
  records: OccupancyAnalysisReportData[];

  deserialize(value: OccupancyAnalysisReportResponse[]): this {
    this.records = new Array<OccupancyAnalysisReportData>();

    this.records =
      value &&
      value.map((item) => {
        return {
          roomType: item.subTotalObject ? 'Sub Total' : item.roomTypeName,
          roomAvailable: item.availableRooms,
          roomRevenue: item.roomRevenue,
          soldRooms: item.soldRooms,
          soldRoomsPercent: item.soldRoomPercentage,
          singleSoldRooms: item.singleSold,
          doubleSoldRooms: item.doubleSold,
          tripleSoldRooms: item.tripleSold,
          quadSoldRooms: item.quardplSold,
          moreQuardplSoldRooms: item.moreQuardplSold,
          pax: item.pax,
          arp: item.arp,
          revPar: item.revPar,
          arrOrAgr: item.arr,
          isSubTotal: item.subTotalObject ? true : false,
        };
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
        guestId: reservationData?.guest?.id,
        reservationNumber: reservationData?.reservationNumber,
        createdOn: getFormattedDate(reservationData?.created),
        bookingNo: reservationData?.reservationNumber,
        guestName: getFullName(
          reservationData?.guest?.firstName,
          reservationData?.guest?.lastName
        ),
        pax: reservationData?.bookingItems[0]?.occupancyDetails.maxAdult,
        rooms: reservationData?.bookingItems[0]?.roomDetails.roomCount,
        roomType: reservationData?.bookingItems[0]?.roomDetails.roomTypeLabel,
        company: reservationData?.guest?.company?.firstName,
        status: reservationData?.status,
        checkIn: getFormattedDate(reservationData?.from),
        checkOut: getFormattedDate(reservationData?.to),
        createdBy: getFullName(
          reservationData?.guest?.firstName,
          reservationData?.guest?.lastName
        ),
      });
    });
    return this;
  }
}

export class BusinessAnalysisReport
  implements
    ReportClass<BusinessAnalysisReportData, BusinessAnalysisReportResponse> {
  records: BusinessAnalysisReportData[];

  deserialize(value: BusinessAnalysisReportResponse) {
    this.records = new Array<BusinessAnalysisReportData>();

    value &&
      Object.keys(value).forEach((key) => {
        const data = value[key];
        this.records.push({
          marketSegment: convertToNormalCase(key),
          nights: data.nights,
          occupancy:
            key === 'subTotal' ? undefined : (data.occupancyPercent ?? 0) + '%',

          pax: data?.pax,
          roomRevenue: toCurrency(data?.roomRevenue),

          revenue:
            key === 'subTotal' ? undefined : (data?.revenuePercent ?? 0) + '%',

          arrOrAgr: toCurrency(data?.arr),
          arp: toCurrency(data?.arp),
        });
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

    value &&
      Object.keys(value).forEach((key) => {
        const data = value[key];
        this.records.push({
          marketSegment: convertToNormalCase(key),
          nights: data?.nights,
          occupancy:
            key === 'subTotal'
              ? undefined
              : (data?.occupancyPercent ?? 0) + '%',

          pax: data?.pax,
          roomRevenue: toCurrency(data?.roomRevenue),

          revenue:
            key === 'subTotal' ? undefined : (data?.revenuePercent ?? 0) + '%',

          arrOrAgr: toCurrency(data?.arr),
          arp: toCurrency(data?.arp),
          // @ts-ignore
          isSubTotal: key === 'subTotal',
        });
      });

    return this;
  }
}
