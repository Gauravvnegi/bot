import {
  DiscountAllowanceReportData,
  DiscountAllowanceReportResponse,
} from '../types/discount-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class DiscountAllowanceReport
  implements
    ReportClass<DiscountAllowanceReportData, DiscountAllowanceReportResponse> {
  records: DiscountAllowanceReportData[];

  deserialize(value: DiscountAllowanceReportResponse[]) {
    this.records = new Array<DiscountAllowanceReportData>();

    value.forEach((reservationData: DiscountAllowanceReportResponse) => {
      this.records.push({
        date: getFormattedDate(reservationData.created),
        group: undefined, //to be added in response
        res: reservationData.number,
        createdBy: undefined, //to be added in response
        guestName: `${reservationData.guestDetails.primaryGuest.firstName} ${reservationData.guestDetails.primaryGuest.lastName}`,
        reasonForDiscount: undefined, //to be added in response
        directDiscount: reservationData.paymentSummary.totalDiscount,
        allowance: undefined, //to be added in response
        total: reservationData.paymentSummary.totalDiscount,
      });
    });
    return this;
  }
}
