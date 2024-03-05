import {
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  AllowanceReportData,
  AllowanceReportResponse,
  DiscountAllowanceReportData,
  DiscountAllowanceReportResponse,
  PromoCodeReportData,
  PromoCodeReportResponse,
} from '../types/discount-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class AllowanceReport
  implements ReportClass<AllowanceReportData, AllowanceReportResponse> {
  records: AllowanceReportData[];

  deserialize(value: AllowanceReportResponse[]) {
    this.records = new Array<AllowanceReportData>();
    value &&
      value.forEach((reservationData: AllowanceReportResponse) => {
        this.records.push({
          reservationId: reservationData?.id,
          date: getFormattedDate(reservationData?.created),
          group: undefined,
          res: reservationData?.number,
          createdBy: getFullName(
            reservationData?.user?.firstName,
            reservationData?.user?.lastName
          ),
          guestName: getFullName(
            reservationData?.guestDetails?.primaryGuest?.firstName,
            reservationData?.guestDetails?.primaryGuest?.lastName
          ),
          reasonForDiscount: undefined,
          allowance: toCurrency(
            reservationData?.paymentSummary?.totalAllowance
          ),
          total: undefined,
        });
      });
    return this;
  }
}

export class DiscountAllowanceReport
  implements
    ReportClass<DiscountAllowanceReportData, DiscountAllowanceReportResponse> {
  records: DiscountAllowanceReportData[];

  deserialize(value: DiscountAllowanceReportResponse[]) {
    this.records = new Array<DiscountAllowanceReportData>();
    value &&
      value.forEach((reservationData: DiscountAllowanceReportResponse) => {
        this.records.push({
          reservationId: reservationData?.id,
          date: getFormattedDate(reservationData.created),
          group: undefined, //to be added in response
          res: reservationData.number,
          createdBy: getFullName(
            reservationData?.user?.firstName,
            reservationData?.user?.lastName
          ), //to be added in response
          guestName: getFullName(
            reservationData.guestDetails.primaryGuest.firstName,
            reservationData.guestDetails.primaryGuest.lastName
          ),
          reasonForDiscount: undefined, //to be added in response
          directDiscount: toCurrency(
            reservationData?.reservationItemsPayment?.totalRoomDiscount
          ),
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
          reservationId: res?.id,
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
