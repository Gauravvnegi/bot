import {
  FolioListReportData,
  FolioListReportResponse,
} from '../types/folio-reports.types';
import { ReportClass } from '../types/reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class FolioListReport
  implements ReportClass<FolioListReportData, FolioListReportResponse> {
  records: FolioListReportData[];
  deserialize(value: FolioListReportResponse[]): this {
    this.records = new Array<FolioListReportData>();
    this.records = value && value.map((item) => {
      return {
        bookingNo: item?.number,
        folioNo: item?.invoiceCode,
        guestName: `${item?.guestDetails.primaryGuest.firstName} ${item?.guestDetails.primaryGuest.lastName}`,
        discount: item?.paymentSummary?.totalDiscount,
        amount: item?.paymentSummary?.totalRoomCharge,
        tax: item?.reservationItemsPayment?.totalCgstTax + item?.reservationItemsPayment?.totalSgstTax,
        btc: undefined, //need to confirm
        cash: undefined, //need to confirm
        bankTransfer: undefined, //need to confirm
        payAtDesk: undefined, //need to confirm
        onlinePaymentGateway: undefined, //need to confirm
        other: undefined, //need to confirm
        paid: item?.reservationItemsPayment?.paidAmount,
        balance: item?.reservationItemsPayment?.dueAmount,
        date: getFormattedDate(item?.created),
      };
    });
    return this;
  }
}
