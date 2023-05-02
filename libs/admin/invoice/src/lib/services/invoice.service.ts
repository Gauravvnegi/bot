import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentHistoryValue } from '../constants/payment-history';
import { QueryConfig } from '../types/invoice.type';

@Injectable()
export class InvoiceService extends ApiService {
  selectedTable = new BehaviorSubject<PaymentHistoryValue>(
    PaymentHistoryValue.ALL
  );

  createInvoice(reservationId: string, data): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/prepare-invoice?format=json&source=BOTSHOT_ADMIN`,
      data
    );
  }

  updateInvoice(reservationId: string, data): Observable<any> {
    return this.patch(
      `/api/v1/reservation/${reservationId}/invoice?source=BOTSHOT_ADMIN`,
      data
    );
  }

  getInvoiceData(reservationId: string): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/invoice?format=json&source=BOTSHOT_ADMIN&created=false`
    );
  }

  downloadPDF(reservationId: string): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/invoice?format=pdf&source=BOTSHOT_ADMIN`
    );
  }

  getPaymentHistory<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/payment${config?.params}`);
  }

  // mapInvoiceData(formValue){
  //     const invoiceData = new InvoiceForm();
  //     invoiceData.guestName = formValue.guestName;
  //     invoiceData.companyName = formValue.companyName;
  //     invoiceData.invoiceDate = formValue.invoiceDate;
  //     invoiceData.arrivalDate = formValue.arrivalDate;
  //     invoiceData.tableData = formValue.tableData;
  //     invoiceData.departureDate = formValue.departureDate;
  //     invoiceData.currentAmount = formValue.currentAmount;
  //     invoiceData.discountedAmount = formValue.discountedAmount;
  //     invoiceData.paidAmount = formValue.paidAmount;
  //     invoiceData.dueAmount = formValue.dueAmount;
  //     invoiceData.discountType = formValue.discountType;
  //     invoiceData.discount = formValue.discount;
  //     invoiceData.paidValue = formValue.paidValue;
  //     invoiceData.paid = formValue.paid;
  //     return invoiceData;
  // }
  mapInvoiceData(formValue) {
    const invoiceData = new CreateInvoice();
    invoiceData.companyName = formValue.companyName;
    invoiceData.cashier = formValue.cashierName;
    invoiceData.invoiceDate = formValue.invoiceDate;
    invoiceData.invoiceItems = formValue.tableData.map((tableRow) => ({
      description: tableRow.description.label,
      amount: tableRow.amount,
      //   unit: tableRow.unit,
      //   unitValue: tableRow.unitValue,
      taxIds: tableRow.tax.map((tax) => (tax.value ? tax.value : '')),
    }));
    invoiceData.originalAmount = formValue.currentAmount;
    invoiceData.totalAmount = formValue.discountedAmount;
    invoiceData.paidAmount = formValue.paidAmount;
    invoiceData.dueAmount = formValue.dueAmount;
    return invoiceData;
  }
}

export class CreateInvoice {
  reservationId: string;
  cashier: string;
  comment: string;
  companyName: string;
  invoiceDate: number;
  invoiceItems: InvoiceItemList[];
  originalAmount: number;
  paidAmount: number;
  dueAmount: number;
  totalAmount: number;
}

export type InvoiceItemList = {
  description: string;
  amount: number;
  // unit: number,
  // unitValue: number,
  transactionType: string;
  taxIds: string[];
};
