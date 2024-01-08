import {
  currencyToNumber,
  toCurrency,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { ReportClass, RowStyles } from '../types/reports.types';
import {
  CashierReportData,
  CashierReportResponse,
  PayTypeReportResponse,
} from '../types/revenue-reports.types';
import {
  getFormattedDate,
  getFormattedDateWithTime,
} from './reservation-reports.models';

export class Cashier extends RowStyles {
  id: string;
  paymentType: string;
  amount: string;
  deserialize(input: CashierReportResponse, id: number, total?: number) {
    this.id = total ? 'Total' : (id + 1).toString();
    this.paymentType = total ? ' ' : input?.paymentMode;
    this.amount = total ? toCurrency(total) : toCurrency(input?.totalAmount);
    this.isSubTotal = total ? true : false;
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

    if (!values.length) return this;

    const groupedData =
      values &&
      values.reduce((acc, curr) => {
        const paymentMethod = curr.paymentMethod;

        let payType =
          paymentMethod === 'Cash Payment' ||
          paymentMethod === 'Bank Transfer' ||
          paymentMethod === 'Bank Deposit'
            ? paymentMethod
            : 'Other';

        if (payType === 'Bank Deposit') payType = 'Bank Transfer';

        if (acc.has(payType)) {
          acc.get(payType).push(new PayTypeReportData().deserialize(curr));
        } else {
          acc.set(payType, [new PayTypeReportData().deserialize(curr)]);
        }

        return acc;
      }, new Map<string, PayTypeReportData[]>());

    // Sum of grouped data
    groupedData.forEach((value, key) => {
      sumGroupedData.set(
        key,
        value.reduce((acc, curr) => {
          return acc + currencyToNumber(curr.amount);
        }, 0)
      );
    });

    this.records = [
      new PayTypeReportData().deserialize({}, 'Cash Payment'),
      ...(groupedData.get('Cash Payment') || []),
      new PayTypeReportData().deserialize({}, '', 'Cash Payment'),
      new PayTypeReportData().deserialize({}, 'Bank Transfer'),
      ...(groupedData.get('Bank Transfer') || []),
      new PayTypeReportData().deserialize({}, '', 'Bank Transfer'),
      new PayTypeReportData().deserialize({}, 'Other'),
      ...(groupedData.get('Other') || []),
      new PayTypeReportData().deserialize({}, '', 'Other'),
    ];
    return this;
  }
}

const sumGroupedData = new Map<string, number>();

class PayTypeReportData extends RowStyles {
  id: string;
  paymentMode?: string;
  paymentType?: string;
  employee?: string;
  bookingNo?: string;
  folioNo?: string;
  guestName?: string;
  room?: string;
  counter?: string;
  dateAndTime?: string;
  amount?: string;
  description?: string;

  deserialize(
    input: Partial<PayTypeReportResponse>,
    paymentMode?: string,
    totalLabel?: string
  ) {
    if (totalLabel) {
      this.setTotalLabel(totalLabel);
    } else if (paymentMode) {
      this.setPaymentModeLabel(paymentMode);
    } else {
      this.setDetails(input);
    }

    return this;
  }

  private setTotalLabel(totalLabel: string) {
    this.paymentMode = `Total ${totalLabel}`;
    this.paymentType = ' ';
    this.employee = ' ';
    this.bookingNo = ' ';
    this.folioNo = ' ';
    this.guestName = ' ';
    this.room = ' ';
    this.counter = ' ';
    this.dateAndTime = ' ';
    this.amount = toCurrency(sumGroupedData.get(totalLabel));
    this.description = ' ';
    this.isSubTotal = true;
  }

  private setPaymentModeLabel(paymentMode: string) {
    this.paymentMode = paymentMode;
    this.paymentType = ' ';
    this.employee = ' ';
    this.bookingNo = ' ';
    this.folioNo = ' ';
    this.guestName = ' ';
    this.room = ' ';
    this.counter = ' ';
    this.dateAndTime = ' ';
    this.amount = ' ';
    this.description = ' ';
    this.isHeader = true;
  }

  private setDetails(input: Partial<PayTypeReportResponse>) {
    (this.id = input?.reservationId), (this.paymentMode = undefined);
    this.paymentType = input?.paymentMethod;

    this.employee =
      (input?.reservation?.user?.firstName ?? '') +
      ' ' +
      (input?.reservation?.user?.lastName ?? '');

    this.bookingNo = input?.reservationNumber;
    this.folioNo = input?.reservation?.invoiceCode;
    this.guestName = `${input?.reservation?.guestDetails?.primaryGuest?.firstName} ${input?.reservation?.guestDetails?.primaryGuest?.lastName}`;
    this.room = `${input?.reservation?.stayDetails?.room?.roomNumber} - ${input?.reservation?.stayDetails?.room?.type}`;
    this.counter = undefined;
    this.dateAndTime =
      input.created && getFormattedDateWithTime(input?.created);
    this.amount = toCurrency(input?.amount);
    this.description = input?.remarks;
  }
}
