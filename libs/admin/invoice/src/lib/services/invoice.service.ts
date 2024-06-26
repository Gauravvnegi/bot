import { Injectable } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { BillItemFields, UseForm } from '../types/forms.types';
import { BillItem, BillSummaryData, QueryConfig } from '../types/invoice.type';
import { AdditionalChargesType } from '../constants/invoice.constant';

@Injectable()
export class InvoiceService extends ApiService {
  invoiceData: BillSummaryData;

  isPrintRate = new BehaviorSubject(true);

  createInvoice(reservationId: string, data): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/prepare-invoice?format=json&source=BOTSHOT_ADMIN`,
      data
    );
  }

  initInvoiceData(input: BillSummaryData) {
    this.invoiceData = input;
  }

  exportInvoiceCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/invoices/export${config.params}`, {
      responseType: 'blob',
    });
  }

  getInvoiceHistory(config?: QueryConfig): Observable<any> {
    return this.get(`/api/v1/invoices${config.params}`);
    // .pipe(
    //   map((res) => {
    //     return invoiceHistoryRes;
    //   })
    // );;
  }

  getReservationDetail(reservationId: string): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  updateInvoice(
    reservationId: string,
    data: Partial<BillSummaryData>
  ): Observable<any> {
    return this.patch(
      `/api/v1/reservation/${reservationId}/bill-summary`,
      data
    );
  }

  generateInvoice(
    reservationId: string,
    paymentState?: string
  ): Observable<any> {
    return this.patch(
      `/api/v1/reservation/${reservationId}/bill-summary` +
        (paymentState ? `?paymentState=${paymentState}` : ''),
      {
        invoiceGenerated: true,
      }
    );
  }

  getInvoiceData(
    reservationId: string,
    isCustomerInvoice?: boolean
  ): Observable<BillSummaryData> {
    return this.get(
      `/api/v1/reservation/${reservationId}/bill-summary` +
        (isCustomerInvoice ? `?isCustomerInvoice=${isCustomerInvoice}` : '')
    );
  }

  downloadPDF(
    reservationId: string,
    paymentState?: string,
    isCustomerInvoice?: boolean
  ): Observable<any> {
    const queryParams = `${paymentState ? `paymentState=${paymentState}` : ''}${
      paymentState && isCustomerInvoice !== undefined ? '&' : ''
    }${
      isCustomerInvoice !== undefined
        ? `isCustomerInvoice=${isCustomerInvoice}`
        : ''
    }`;
    return this.get(
      `/api/v1/reservation/${reservationId}/invoice${
        queryParams ? '?' + queryParams : ''
      }`
    );
  }

  emailInvoice(reservationId: string, data) {
    return this.post(
      `/api/v1/reservation/${reservationId}/send-invoice?source=BOTSHOT_ADMIN`,
      data
    );
  }

  generateBillItem(settings: Partial<BillItemFields>): BillItemFields {
    const epochDate = moment(new Date()).unix() * 1000;
    return {
      key: `${epochDate}`,
      creditAmount: 0,
      billItemId: '',
      date: epochDate,
      debitAmount: 0,
      description: '',
      isDisabled: false,
      isDiscount: false,
      isNonEditableBillItem: false,
      isMiscellaneous: false,
      isNew: true,
      itemId: '',
      taxId: null,
      transactionType: 'DEBIT',
      unit: 1,
      isAddOn: true,
      reservationItemId: '',
      isRefund: false,
      ...settings,
    };
  }

  getPostInvoiceData(
    invoiceFormData: UseForm,
    data: {
      reservationId: string;
      guestId: string;
      entityId: string;
      currency: string;
    },
    descriptionData: Option[],
    isPayment: boolean
  ): Partial<BillSummaryData> {
    const descriptionIds = [];
    const previousSavedIds = this.invoiceData.billItems.map((item) => item.id);
    const billItems: BillItem[] = invoiceFormData.tableData.map((item) => {
      descriptionIds.push(item.billItemId);

      let billItemData = {
        date: item.date,
        description: item.description,
        unit: item.unit,
        creditAmount: +item.creditAmount,
        debitAmount: +item.debitAmount,
        transactionType: item.transactionType,
        id: item.isNew ? null : item.billItemId,
        itemId: item.isNonEditableBillItem ? null : item.itemId,
        taxId: item.taxId,
        isCoupon: item.isDiscount,
        chargeType: item.chargeType,
        ...(item.chargeType === 'ALLOWANCE' && { remarks: item.remarks }),
        ...(item.isDiscount && {
          discountType: item.discountType,
          discountValue: item.discountValue,
        }),
        ...(item.isDiscount ? {} : { isRealised: item.isRealised }),
      };
      return billItemData;
    });

    const deletedItemsId = previousSavedIds.filter(
      (item) => !descriptionIds.includes(item)
    );

    if (invoiceFormData.receivedPayment) {
      const transactionText = invoiceFormData.transactionId
        ? `[${invoiceFormData.transactionId}]`
        : '';
      const remarksText = invoiceFormData.remarks
        ? ` (${invoiceFormData.remarks})`
        : '';
      const methodText = invoiceFormData.paymentMethod
        ? `: ${invoiceFormData.paymentMethod}`
        : '';
      const refundMethod = invoiceFormData.refundMethod
        ? `: ${invoiceFormData.refundMethod}`
        : '';

      const paymentItem: BillItem = isPayment
        ? {
            date: moment(new Date()).unix() * 1000,
            description: `${transactionText} Payment Received ${methodText} ${remarksText}`,
            unit: 1,
            creditAmount: invoiceFormData.receivedPayment,
            transactionType: 'CREDIT',
            debitAmount: 0,
            id: null,
            chargeType: 'PAYMENT',
          }
        : {
            date: moment(new Date()).unix() * 1000,
            description: `${transactionText} Refund ${refundMethod} ${remarksText}`,
            unit: 1,
            creditAmount: 0,
            transactionType: 'DEBIT',
            debitAmount: invoiceFormData.receivedPayment,
            id: null,
            isRefund: true,
            chargeType: 'REFUND',
          };

      billItems.push(paymentItem);
    }

    const res: Partial<BillSummaryData> = {
      companyDetails: invoiceFormData.companyName
        ? {
            id: '',
            gstNumber: invoiceFormData.gstNumber,
            companyName: invoiceFormData.companyName,
            contactNumber: invoiceFormData.contactNumber,
            email: invoiceFormData.email,

            address: {
              city: invoiceFormData.city,
              country: '',
              postalCode: invoiceFormData.pin,
              countryCode: '',
              addressLine1: invoiceFormData.address,
              addressLine2: '',
              state: invoiceFormData.state,
              reservationId: data.reservationId,
              guestId: data.guestId,
              guestType: '',
            },
          }
        : null,
      billItems,
      deleteInvoiceItems: deletedItemsId.length ? deletedItemsId : null,
      invoiceGenerated: false,
      cashier: invoiceFormData.cashierName,
      cashierId: invoiceFormData.cashierId,
      remarks: invoiceFormData.additionalNote,
      isRefund: !isPayment,
      // Payment info (BE related - to maintain history)
      ...(invoiceFormData.receivedPayment
        ? {
            paymentRemarks: invoiceFormData.remarks,
            paymentMethod: isPayment
              ? invoiceFormData.paymentMethod
              : invoiceFormData.refundMethod,
            transactionId: invoiceFormData.transactionId,
            paymentAmount: invoiceFormData.receivedPayment,
          }
        : {}),
    };

    return res;
  }

  handleInvoiceDownload(reservationId: string) {
    this.downloadPDF(reservationId, 'REALISED').subscribe((res) => {
      const fileUrl = res.file_download_url;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.setRequestHeader('Content-type', 'application/pdf');
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Specify the desired filename here
          const fileName = fileUrl.split('/').pop();
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };
      xhr.send();
    });
  }
}
