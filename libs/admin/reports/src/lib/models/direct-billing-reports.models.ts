import { getFullName, toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
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
          guestId: item?.guest?.id,
          agentCode: item?.agent?.code,
          agentName: getFullName(item?.agent?.firstName, item?.agent?.lastName),
          bookingNo: item?.reservationNumber,
          guestName: `${item?.guest?.firstName ?? ''} ${
            item?.guest?.lastName ?? ''
          }`,
          roomType: item?.bookingItems[0]?.roomDetails?.roomTypeLabel,
          roomNo: item?.bookingItems[0]?.roomDetails?.roomNumber,
          checkInDate: getFormattedDate(item?.from),
          checkOutDate: getFormattedDate(item?.to),
          totalNights: item?.nightsCount,
          pax:
            item.bookingItems[0]?.occupancyDetails?.maxAdult +
            item.bookingItems[0]?.occupancyDetails?.maxChildren,

          postTaxAmount: toCurrency(
            (item?.pricingDetails?.taxAndFees ?? 0) +
              (item?.pricingDetails?.totalAmount ?? 0)
          ),

          totalAmount: toCurrency(item?.pricingDetails?.totalAmount),

          totalPaidAmount: toCurrency(item?.pricingDetails?.totalPaidAmount),

          totalDueAmount: toCurrency(item?.pricingDetails?.totalDueAmount),
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
          guestId: item?.guest?.id,
          companyCode: item?.company?.code,
          companyName: item?.company?.firstName,
          bookingNo: item?.reservationNumber,
          guestName: getFullName(item?.guest?.firstName, item?.guest?.lastName),
          roomType: item?.bookingItems[0]?.roomDetails?.roomTypeLabel,
          roomNo: item?.bookingItems[0]?.roomDetails?.roomNumber,
          checkInDate: getFormattedDate(item?.from),
          checkOutDate: getFormattedDate(item?.to),
          totalNights: item?.nightsCount,
          pax: item.bookingItems[0]?.occupancyDetails?.maxAdult,
          totalPaidAmount: toCurrency(item?.pricingDetails?.totalPaidAmount),
          postTaxAmount: toCurrency(item?.pricingDetails?.taxAndFees),
          totalAmount: toCurrency(item?.pricingDetails?.totalAmount),
          totalDueAmount: toCurrency(item?.pricingDetails?.totalDueAmount),
        };
      });
    }
    return this;
  }
}
