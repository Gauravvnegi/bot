import { ReportClass, RowStyles } from '../types/reports.types';
import {
  CashierReportData,
  CashierReportResponse,
  PayTypeReportData,
  PayTypeReportResponse,
} from '../types/revenue-reports.types';
import { getFormattedDate } from './reservation-reports.models';

export class Cashier extends RowStyles {
  id: string;
  paymentType: string;
  amount: number;
  deserialize(input: CashierReportResponse, id: number, total?: number) {
    this.id = total ? ' ' : (id + 1).toString();
    this.paymentType = total ? ' ' : input?.paymentMode;
    this.amount = total ? total : input?.totalAmount;
    this.isBold = total ? true : undefined;
    this.isGreyBg = total ? true : undefined;
    return this;
  }
}

export class CashierReport implements ReportClass<CashierReportData, any> {
  records: CashierReportData[];
  deserialize(values: CashierReportResponse[]) {
    let total = 0;
    this.records =
      values &&
      values.map((item, index) => {
        total = total + item.totalAmount;
        return new Cashier().deserialize(item, index);
      });
    values && this.records.push(new Cashier().deserialize(null, null, total));
    return this;
  }
}

export class PayTypeReport
  implements ReportClass<PayTypeReportData, PayTypeReportResponse> {
  records: PayTypeReportData[];
  deserialize(values: PayTypeReportResponse[]) {
    this.records = new Array<PayTypeReportData>();
    this.records =
      values &&
      values.map((item) => {
        return {
          paymentMode: item.paymentMethod,
          paymentType: undefined,
          employee: undefined,
          bookingNo: item.reservationNumber,
          folioNo: undefined,
          guestName: `${item.reservation.guestDetails.primaryGuest.firstName} ${item.reservation.guestDetails.primaryGuest.lastName}`,
          room: `${item.reservation.stayDetails.room.roomNumber} - ${item.reservation.stayDetails.room.type}`,
          counter: undefined,
          dateAndTime: getFormattedDate(item.created),
          amount: item.amount,
          description: undefined,
        };
      });
    return this;
  }
}
