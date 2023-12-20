import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  DiscountAllowanceReportData,
  DiscountAllowanceReportResponse,
  PromoCodeReportData,
  PromoCodeReportResponse,
} from '../types/discount-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class DiscountAllowanceReport
  implements
    ReportClass<DiscountAllowanceReportData, DiscountAllowanceReportResponse> {
  records: DiscountAllowanceReportData[];

  deserialize(value: DiscountAllowanceReportResponse[]) {
    this.records = new Array<DiscountAllowanceReportData>();
    value &&
      value.forEach((reservationData: DiscountAllowanceReportResponse) => {
        this.records.push({
          id: reservationData?.id,
          date: getFormattedDate(reservationData.created),
          group: undefined, //to be added in response
          res: reservationData.number,
          createdBy:
            reservationData?.user?.firstName &&
            `${reservationData?.user?.firstName} ${reservationData?.user?.lastName}`, //to be added in response
          guestName: `${reservationData.guestDetails.primaryGuest.firstName} ${reservationData.guestDetails.primaryGuest.lastName}`,
          reasonForDiscount: undefined, //to be added in response
          directDiscount: toCurrency(
            reservationData?.reservationItemsPayment?.totalRoomDiscount
          ),
          allowance: undefined, //to be added in response
          total: toCurrency(
            reservationData.reservationItemsPayment.totalRoomDiscount +
              reservationData.reservationItemsPayment.totalAddOnsDiscount
          ),
        });
      });
    return this;
  }
}

export class PromoCodeReport
  implements ReportClass<PromoCodeReportData, PromoCodeReportResponse> {
  records: PromoCodeReportData[];

  deserialize(value: PromoCodeReportResponse[]): this {
    this.records =
      value &&
      value.map((res) => {
        return {
          id: res?.id,
          promoCode: res?.offer?.packageCode,
          discount: toCurrency(res?.offer?.discountedPrice),
          redemptions: getFormattedDate(res?.arrivalTime),
          totalNights: res?.nightCount,
          totalRevenueEarned: toCurrency(res?.paymentSummary?.totalAmount),
        };
      });
    return this;
  }
}
