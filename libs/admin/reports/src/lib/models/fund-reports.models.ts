import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  AddWithdrawReportData,
  AddWithdrawReportResponse,
} from '../types/fund-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class AddWithdrawReport
  implements ReportClass<AddWithdrawReportData, AddWithdrawReportResponse> {
  records: AddWithdrawReportData[];

  deserialize(value: AddWithdrawReportResponse[]): this {
    this.records =
      value &&
      value.map((data) => {
        return {
          reservationId: data?.reservationId,
          createdDate: getFormattedDate(data?.created),
          fundTransferredBy:
            data?.cashier?.firstName &&
            `${data?.cashier?.firstName ?? ''} ${
              data?.cashier?.lastName ?? ''
            }`,
          action: data?.paymentType,
          amount: toCurrency(data?.amount),
          paymentMode: data?.paymentMethod ?? undefined,
          comments: data?.remarks,
        };
      });
    return this;
  }
}
