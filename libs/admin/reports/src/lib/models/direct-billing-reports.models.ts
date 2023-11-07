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
          agentCode: undefined, // to be added in response
          agentName: undefined, // to be added in response
          bookingNo: item.reservationNumber,
          guestName: `${item.guest.firstName} ${item.guest.lastName}`,
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
          companyCode: undefined, // to be added in response
          companyName: undefined, // to be added in response
          bookingNo: undefined, // to be added in response
          guestName: undefined, // to be added in response
          roomType: undefined, // to be added in response
          roomNo: undefined, // to be added in response
          checkInDate: undefined, // to be added in response
          checkOutDate: undefined, // to be added in response
          totalNights: undefined, // to be added in response
          pax: undefined, // to be added in response
          totalPaidAmount: undefined, // to be added in response
          postTaxAmount: undefined, // to be added in response
          totalAmount: undefined, // to be added in response
          totalDueAmount: undefined, // to be added in response
        };
      });
    }
    return this;
  }
}

