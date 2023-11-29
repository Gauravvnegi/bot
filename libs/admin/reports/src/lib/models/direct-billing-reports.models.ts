import {
  DirectAgentBillingReportData,
  DirectAgentBillingReportResponse,
  DirectCompanyBillingReportData,
  DirectCompanyBillingReportResponse,
} from '../types/direct-billings-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class DirectAgentBillingReport
  implements
    ReportClass<
      DirectAgentBillingReportData,
      DirectAgentBillingReportResponse
    > {
  records: DirectAgentBillingReportData[];

  deserialize(value: DirectAgentBillingReportResponse[]) {
    this.records = new Array<DirectAgentBillingReportData>();
    if (value instanceof Array) {
      this.records = value.map((item) => {
        return {
          agentCode: item?.agent?.code,
          agentName: item?.agent && `${item?.agent?.firstName} ${item?.agent?.lastName}`,
          bookingNo: item.reservationNumber,
          guestName: `${item.guest.firstName ?? ''} ${item.guest.lastName ?? ''}`,
          roomType: item.bookingItems[0].roomDetails.roomTypeLabel,
          roomNo: item.bookingItems[0].roomDetails.roomNumber,
          checkInDate: getFormattedDate(item.from),
          checkOutDate: getFormattedDate(item.to),
          totalNights: item.guest.totalNights,
          pax: item.bookingItems[0].occupancyDetails.maxAdult,
          totalPaidAmount: item.pricingDetails.totalPaidAmount,
          totalDueAmount: item.pricingDetails.totalDueAmount,
        };
      });
    }
    return this;
  }
}

export class DirectCompanyBillingReport
  implements
    ReportClass<
      DirectCompanyBillingReportData,
      DirectCompanyBillingReportResponse
    > {
  records: DirectCompanyBillingReportData[];

  deserialize(value: DirectCompanyBillingReportResponse[]) {
    this.records = new Array<DirectCompanyBillingReportData>();
    if (value instanceof Array) {
      this.records = value.map((item) => {
        return {
          companyCode: item.guest.company.code,
          companyName: item.guest.company.firstName,
          bookingNo: item.reservationNumber,
          guestName: `${item.guest.firstName} ${item.guest.lastName}`,
          roomType: item.bookingItems[0].roomDetails.roomTypeLabel,
          roomNo: item.bookingItems[0].roomDetails.roomNumber,
          checkInDate: getFormattedDate(item.from),
          checkOutDate: getFormattedDate(item.to),
          totalNights: item.nightCount,
          pax: item.bookingItems[0].occupancyDetails.maxAdult,
          totalPaidAmount: item.pricingDetails.totalPaidAmount,
          postTaxAmount: item.pricingDetails.taxAndFees,
          totalAmount: item.pricingDetails.totalAmount,
          totalDueAmount: item.pricingDetails.totalDueAmount,
        };
      });
    }
    return this;
  }
}
