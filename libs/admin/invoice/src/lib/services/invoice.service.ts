import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentHistoryValue } from '../constants/payment-history';
import { Invoice } from '../models/invoice.model';
import { InvoiceData, QueryConfig } from '../types/invoice.type';
import { InvoiceResponse } from '../types/response.type';

const resPonse = {
  id: 'c360ff16-a68a-4780-91a9-f6c2209b35e8',
  reservation: {
    arrivalTime: 1683813190000,
    departureTime: 1684159071000,
    number: '043442200',
    stateCompletedSteps: 0,
    totalRoomCount: 0,
    totalDueAmount: 21240,
    totalPaidAmount: 0,
    totalAmount: 21240,
    invoicePrepareRequest: false,
    vip: false,
  },
  companyDetails: {
    id: 'c4aa2e20-0728-4ed0-94d3-176b6b0116c9',
    companyName: '',
    email: '',
    address: {
      created: 1683815119954,
      updated: 1683815119954,
      id: 'b5531fe7-7f50-4f12-bc8f-e33e3ffd99aa',
      city: '',
      country: '',
      countryCode: '',
      postalCode: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      reservationId: '67c517d7-e32c-49f2-9913-c991e9191960',
      guestId: 'bf501cc2-3e9d-42c7-9a27-0f4bd94b06d2',
      guestType: '',
    },
    contactNumber: '',
    contactName: '',
    gstNumber: '',
  },
  itemList: [
    {
      created: 0,
      updated: 0,
      id: 'f182cce5-2210-4491-a1d3-10e1f9d9d1ac',
      description: 'Deluxe Room',
      unit: 1,
      amount: 9000,
      itemTax: [
        {
          created: 1680594248000,
          updated: 1682170420458,
          id: '1a4b5b2c-99b5-4b17-b1ba-1856e051e723',
          country: 'India',
          taxType: 'SGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
        {
          created: 1,
          updated: 1680594248000,
          id: '7c096dd2-afd6-40a7-b1f5-4b45aea628d2',
          country: 'India',
          taxType: 'CGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
      ],
      billDate: 1683813190000,
      itemCode: 'G01',
      perUnitPrice: 0,
      isAddOn: false,
    },
    {
      created: 0,
      updated: 0,
      id: '0a56f6ae-74b4-4007-b250-ac4c84ea8c48',
      description: 'Deluxe Room',
      unit: 1,
      amount: 9000,
      itemTax: [
        {
          created: 1680594248000,
          updated: 1682170420458,
          id: '1a4b5b2c-99b5-4b17-b1ba-1856e051e723',
          country: 'India',
          taxType: 'SGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
        {
          created: 1,
          updated: 1680594248000,
          id: '7c096dd2-afd6-40a7-b1f5-4b45aea628d2',
          country: 'India',
          taxType: 'CGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
      ],
      billDate: 1683899590000,
      itemCode: 'G01',
      perUnitPrice: 0,
      isAddOn: false,
    },
    {
      created: 0,
      updated: 0,
      id: 'eb164cda-9c25-43d0-b84e-9c35721076cb',
      description: 'Deluxe Room',
      unit: 1,
      amount: 9000,
      itemTax: [
        {
          created: 1680594248000,
          updated: 1682170420458,
          id: '1a4b5b2c-99b5-4b17-b1ba-1856e051e723',
          country: 'India',
          taxType: 'SGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
        {
          created: 1,
          updated: 1680594248000,
          id: '7c096dd2-afd6-40a7-b1f5-4b45aea628d2',
          country: 'India',
          taxType: 'CGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
      ],
      billDate: 1683985990000,
      itemCode: 'G01',
      perUnitPrice: 0,
      isAddOn: false,
    },
    {
      created: 0,
      updated: 0,
      id: 'ff382311-899d-463f-9dbe-40548f3c65d5',
      description: 'Deluxe Room',
      unit: 1,
      amount: 9000,
      itemTax: [
        {
          created: 1680594248000,
          updated: 1682170420458,
          id: '1a4b5b2c-99b5-4b17-b1ba-1856e051e723',
          country: 'India',
          taxType: 'SGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
        {
          created: 1,
          updated: 1680594248000,
          id: '7c096dd2-afd6-40a7-b1f5-4b45aea628d2',
          country: 'India',
          taxType: 'CGST',
          taxValue: 9,
          category: 'room',
          status: true,
        },
      ],
      billDate: 1684072390000,
      itemCode: 'G01',
      perUnitPrice: 0,
      isAddOn: false,
    },
    {
      created: 0,
      updated: 0,
      id: 'b5ae8af1-1143-4959-a47c-f6dc567bf267',
      description: 'gsdsfg',
      unit: 1,
      amount: 123,
      discount: {
        type: 'PERCENT',
        value: 10,
      },
      itemTax: [
        {
          category: 'service',
          country: 'India',
          created: 1682253912734,
          id: 'b2c12858-ceb3-4d36-b450-6c329eff3a2d',
          status: true,
          taxType: 'CGST',
          taxValue: 2.5,
          updated: 1682253934520,
        },
      ],
      billDate: 1683763200000,
      perUnitPrice: 123,
      isAddOn: true,
    },
  ],
  invoicePaidAmount: 12000,
  invoiceDueAmount: 30618.4,
  originalAmount: 0,
  invoiceAmount: 42618.4,
  invoiceDate: 1683815120951,
  primaryGuest: {
    id: 'bf501cc2-3e9d-42c7-9a27-0f4bd94b06d2',
    firstName: 'Shivendra',
    contactDetails: {
      cc: '+355',
      contactNumber: '09870455182',
      emailId: 'chargecard@mailinator.com',
    },
    age: 0,
    documentRequired: false,
  },
  roomNumber: '0',
  invoiceCode: 'LA27/23-24',
  invoiceGenerated: false,
};

@Injectable()
export class InvoiceService extends ApiService {
  invoiceData: InvoiceResponse;
  selectedTable = new BehaviorSubject<PaymentHistoryValue>(
    PaymentHistoryValue.ALL
  );

  createInvoice(reservationId: string, data): Observable<any> {
    return this.put(
      `/api/v1/reservation/${reservationId}/prepare-invoice?format=json&source=BOTSHOT_ADMIN`,
      data
    );
  }

  initInvoiceData(input: InvoiceResponse) {
    this.invoiceData = input;
  }

  updateInvoice(reservationId: string, data: InvoiceData): Observable<any> {
    return this.patch(
      `/api/v1/reservation/${reservationId}/invoice?source=BOTSHOT_ADMIN`,
      data
    );
  }

  generateInvoice(reservationId: string): Observable<any> {
    return this.patch(
      `/api/v1/reservation/${reservationId}/invoice?source=BOTSHOT_ADMIN`,
      { invoiceGenerated: true }
    );
  }

  getInvoiceData(reservationId: string): Observable<InvoiceResponse> {
    return this.get(
      `/api/v1/reservation/${reservationId}/invoice?format=json&source=BOTSHOT_ADMIN`
    )
    // .pipe(
    //   map((res) => {
    //     return resPonse as InvoiceResponse;
    //   })
    // );
  }

  downloadPDF(reservationId: string): Observable<any> {
    return this.get(
      `/api/v1/reservation/${reservationId}/invoice?format=pdf&source=BOTSHOT_ADMIN`
    );
  }

  emailInvoice(reservationId: string, data) {
    return this.post(
      `/api/v1/reservation/${reservationId}/send-invoice?source=BOTSHOT_ADMIN`,
      data
    );
  }

  getPaymentHistory<T>(config?: QueryConfig): Observable<T> {
    return this.get(`/api/v1/payment${config?.params}`);
  }

  getPostInvoiceData(
    invoiceFormData: Invoice,
    data: {
      reservationId: string;
      guestId: string;
      hotelId: string;
      currency: string;
    }
  ): InvoiceData {
    const descriptionIds = [];
    const previousSavedIds = this.invoiceData.itemList.map((item) => item.id);

    const tableData = invoiceFormData.tableData.reduce((prev, curr) => {
      if (curr.type === 'discount') {
        prev[prev.length - 1]['discountType'] = curr.discountType;
        prev[prev.length - 1]['discountValue'] = curr.discount;
        return prev;
      }
      if (curr.type === 'price') {
        const currentId = curr.description;
        descriptionIds.push(currentId);
        const data = {
          [previousSavedIds.includes(currentId) ? 'id' : 'itemId']: currentId,
          unit: curr.unit,
          unitValue: curr.unitValue,
        };
        return [...prev, data];
      }
    }, []);

    const deletedItemsId = previousSavedIds.filter(
      (item) => !descriptionIds.includes(item)
    );

    const res: InvoiceData = {
      id: invoiceFormData.invoiceId,
      companyDetails: {
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
      },
      payment: {
        entityId: data.hotelId,
        transactionId: invoiceFormData.transactionId,
        amount: invoiceFormData.receivedPayment,
        currency: data.currency,
        status: 'SUCCESS',
        orderId: '',
        payOnDesk: invoiceFormData.paymentMethod === 'payAtDesk',
        paymentMode: invoiceFormData.paymentMethod,
        reservationId: data.reservationId,
      },
      invoiceItems: tableData as InvoiceData['invoiceItems'],
      deleteInvoiceItems: deletedItemsId.length ? deletedItemsId : null,
      // ...( data.deletedItemsId?.length ?{deleteInvoiceItems: data.deletedItemsId}:{}),
    };

    return res;
  }
}
