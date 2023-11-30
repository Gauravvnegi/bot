import {
  FolioListReportData,
  FolioListReportResponse,
} from '../types/folio-reports.types';
import { ReportClass } from '../types/reports.types';
import { getPaymentMethodAmount } from './financial-reports.models';
import { getFormattedDate } from './reservation-reports.models';

export class FolioListReport
  implements ReportClass<FolioListReportData, FolioListReportResponse> {
  records: FolioListReportData[];
  deserialize(value: FolioListReportResponse[]): this {
    this.records = new Array<FolioListReportData>();
    this.records =
      value &&
      value.map((item) => {
        return {
          bookingNo: item?.number,
          folioNo: item?.invoiceCode,
          guestName: `${item?.guestDetails.primaryGuest.firstName} ${item?.guestDetails.primaryGuest.lastName}`,
          discount: item?.paymentSummary?.totalDiscount,
          amount: item?.paymentSummary?.totalRoomCharge,
          tax:
            item?.reservationItemsPayment?.totalCgstTax +
            item?.reservationItemsPayment?.totalSgstTax,
          btc: getPaymentMethodAmount(item, 'Bill to Company'),
          cash: getPaymentMethodAmount(item, 'Cash Payment'),
          bankTransfer: getPaymentMethodAmount(item, 'Bank Transfer'),
          payAtDesk: getPaymentMethodAmount(item, 'Pay at Desk'),
          onlinePaymentGateway:
            getPaymentMethodAmount(item, 'CCAVENUE') +
            getPaymentMethodAmount(item, 'Stripe'),
          other: item?.paymentModesAndTotalAmount.reduce((acc, curr) => {
            if (
              ![
                'Bill to Company',
                'Cash Payment',
                'Bank Transfer',
                'Pay at Desk',
                'CCAVENUE',
                'Stripe',
              ].includes(curr.paymentMode)
            ) {
              acc += curr.totalAmount;
            }
            return acc;
          }, 0),

          paid: item?.reservationItemsPayment?.paidAmount,
          balance: item?.reservationItemsPayment?.dueAmount,
          date: getFormattedDate(item?.created),
        };
      });
    return this;
  }
}
