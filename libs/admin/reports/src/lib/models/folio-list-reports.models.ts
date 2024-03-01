import {
  currencyToNumber,
  getFullName,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
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
          reservationId: item?.id,
          bookingNo: item?.number,
          folioNo: item?.invoiceCode,
          guestName: getFullName(
            item?.guestDetails.primaryGuest.firstName,
            item?.guestDetails.primaryGuest.lastName
          ),
          discount: toCurrency(item?.reservationItemsPayment?.totalDiscount),
          amount: toCurrency(item?.reservationItemsPayment?.totalRoomCharge),
          tax: toCurrency(
            item?.reservationItemsPayment?.totalCgstTax +
              item?.reservationItemsPayment?.totalSgstTax
          ),
          btc: getPaymentMethodAmount(item, 'Bill To Company'),
          cash: getPaymentMethodAmount(item, 'Cash Payment'),
          bankTransfer: toCurrency(
            currencyToNumber(getPaymentMethodAmount(item, 'Bank Transfer')) +
              currencyToNumber(getPaymentMethodAmount(item, 'Bank Deposit'))
          ),
          payAtDesk: getPaymentMethodAmount(item, 'Pay at Desk'),
          onlinePaymentGateway: toCurrency(
            currencyToNumber(getPaymentMethodAmount(item, 'CCAVENUE')) +
              currencyToNumber(getPaymentMethodAmount(item, 'Stripe')) +
              currencyToNumber(getPaymentMethodAmount(item, 'PAYU'))
          ),
          other: toCurrency(
            item?.paymentModesAndTotalAmount.reduce((acc, curr) => {
              if (
                ![
                  'Bill To Company',
                  'Cash Payment',
                  'Bank Transfer',
                  'Pay at Desk',
                  'CCAVENUE',
                  'Stripe',
                  'PAYU',
                ].includes(curr.paymentMode)
              ) {
                acc += curr.totalAmount;
              }
              return acc;
            }, 0)
          ),

          paid: toCurrency(item?.reservationItemsPayment?.paidAmount),
          balance: toCurrency(item?.reservationItemsPayment?.dueAmount),
          date: getFormattedDate(item?.created),
        };
      });
    return this;
  }
}
