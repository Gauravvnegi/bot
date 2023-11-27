import { ReportClass, RowStyles } from '../types/reports.types';
import {
  CashierReportData,
  CashierReportResponse,
  PayTypeReportData,
  PayTypeReportResponse,
} from '../types/revenue-reports.types';

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
    this.records = values && values.map((item, index) => {
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
    return this;
  }
}
