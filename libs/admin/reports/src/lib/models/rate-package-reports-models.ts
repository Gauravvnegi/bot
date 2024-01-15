import { unescape } from 'lodash';
import {
  RateVariationReportData,
  RateVariationReportResponse,
} from '../types/rate-package-reports.types';
import { ReportClass } from '../types/reports.types';
import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { getFullName } from '../constant/reports.const';

export class RateVariationReport
  implements ReportClass<RateVariationReportData, RateVariationReportResponse> {
  records: RateVariationReportData[];

  deserialize(value: RateVariationReportResponse[]): this {
    this.records =
      value &&
      value.map((data) => {
        return {
          id: data?.id,
          bookingNo: data?.number,
          folio: data?.invoiceCode,
          roomNo: data?.stayDetails?.room?.roomNumber,
          roomType: data?.stayDetails?.room?.type,
          employee: getFullName(data?.user?.firstName, data?.user?.lastName),

          guestName: getFullName(
            data?.guestDetails?.primaryGuest?.firstName,
            data?.guestDetails?.primaryGuest?.lastName
          ),

          discountedRate: toCurrency(data?.paymentSummary?.totalAmount),

          rateVariance: toCurrency(
            data?.reservationItemsPayment?.totalRoomDiscount
          ),

          actualRate: toCurrency(
            data?.paymentSummary?.totalAmount +
              data?.reservationItemsPayment?.totalRoomDiscount
          ),
        };
      });
    return this;
  }
}
