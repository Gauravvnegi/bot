import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentHistoryValue } from '../constants/payment-history';
import { QueryConfig } from '../types/invoice.type';
import { InvoiceForm } from '../types/forms.types';

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
      `/api/v1/reservation/${reservationId}/invoice?format=json&source=BOTSHOT_ADMIN`
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
    const invoiceData = new InvoiceFormData();

    invoiceData.companyDetails.companyName = formValue.companyName;
    invoiceData.companyDetails.gstNumber = formValue.gstNumber;
    invoiceData.companyDetails.contactNumber = formValue.contactNumber;
    invoiceData.companyDetails.email = formValue.email;
    invoiceData.companyDetails.address.city = formValue.city;
    invoiceData.companyDetails.address.state = formValue.state;
    invoiceData.companyDetails.address.addressLine1 = formValue.address;
    invoiceData.companyDetails.address.postalCode = formValue.pin;
    invoiceData.companyDetails.address.city = formValue.city;

    invoiceData.payment.transactionId = formValue.transactionId;
    invoiceData.payment.paymentMode = formValue.paymentMethod;
    
    invoiceData.invoiceItems = formValue.tableData.map((row)=>{
      itemId: row.description.value
      unit: row.unit
      discountType: row.discountType.value
      discountValue: row.discount
    })
    
    // invoiceData.cashier = formValue.cashierName;
    // invoiceData.invoiceDate = formValue.invoiceDate;
    // invoiceData.invoiceItems = formValue.tableData.map((tableRow) => ({
    //   description: tableRow.description.label,
    //   amount: tableRow.amount,
    //   //   unit: tableRow.unit,
    //   //   unitValue: tableRow.unitValue,
    //   taxIds: tableRow.tax.map((tax) => (tax.value ? tax.value : '')),
    // }));
    // invoiceData.originalAmount = formValue.currentAmount;
    // invoiceData.totalAmount = formValue.discountedAmount;
    // invoiceData.paidAmount = formValue.paidAmount;
    // invoiceData.dueAmount = formValue.dueAmount;
    return invoiceData;
  }
}


export class InvoiceFormData {
  id: string;
  companyDetails: CompanyDetails;
  payment: Payment;
  invoiceItems: InvoiceItems[];
  deleteInvoiceItems: string[];
}

export type InvoiceItems = {
  itemId: string;
  unit: number;
  discountType: 'NUMBER' | 'PERCENT'
  discountValue: string;
}

export type Payment = {
  entityId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  orderId: string;
  payOnDesk: boolean;
  paymentMode: string;
  reservationId: string;
}

export type CompanyDetails = {
  id: string;
  gstNumber: string;
  companyName: string;
  email: string;
  address: Address;
  contactNumber: string;
}

export type Address = {
  city: string;
  country: string;
  postalCode: string;
  countryCode: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  reservationId: string;
  guestId: string;
  guestType: string;

}
