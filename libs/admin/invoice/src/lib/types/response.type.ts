const invoiceRes: InvoiceResponse = {
  id: '3f109361-8cb7-4097-b76a-82bccdaffd42',
  reservation: {
    arrivalTime: 1683693950000,
    departureTime: 1683780050000,
    number: '438980148',
    stateCompletedSteps: 0,
    totalRoomCount: 0,
    totalDueAmount: 991.2,
    totalPaidAmount: 0,
    totalAmount: 991.2,
    invoicePrepareRequest: false,
    vip: false,
  },
  itemList: [
    {
      created: 0,
      updated: 0,
      id: '8831eaf9-7348-470f-a3eb-96a7e166dbc7',
      description: 'Has Service',
      unit: 1,
      amount: 840,
      discount: {
        type: 'FLAT',
        value: 10,
        amount: 200,
      },
      itemTax: [
        {
          created: 1682070039353,
          updated: 1682253952960,
          id: '300d7843-fa03-4cb5-aa37-b70a76e507e4',
          country: 'India',
          taxType: 'CGST',
          taxValue: 6,
          category: 'room',
          status: true,
        },
        {
          created: 1680594248000,
          updated: 1680594248000,
          id: '3ab31813-7538-4b85-94a6-5b2c153b6eb7',
          country: 'India',
          taxType: 'SGST',
          taxValue: 6,
          category: 'room',
          status: true,
        },
        {
          created: 2,
          updated: 1680594248000,
          id: '4b361ba6-6143-4cde-ae5f-c4efc7e8b60f',
          country: 'India',
          taxType: 'CGST',
          taxValue: 6,
          category: 'room',
          status: true,
        },
      ],
      billDate: 1683693950000,
      itemCode: 'dax85',
      perUnitPrice: 840,
      isAddOn: false,
    },
  ],
  invoicePaidAmount: 0,
  invoiceDueAmount: 991.2,
  originalAmount: 0,
  invoiceAmount: 991.2,
  invoiceDate: 1683703932051,
  primaryGuest: {
    id: 'aa78c7a3-c518-4810-aad0-75a71498f5e7',
    firstName: 'John',
    lastName: 'Wick',
    contactDetails: {
      cc: '+91',
      contactNumber: '898781239',
      emailId: 'wick@god.com',
    },
    age: 0,
    documentRequired: false,
  },
  roomNumber: '0',
  invoiceCode: 'LA1/23-24',
  invoiceGenerated: false,
};

export class InvoiceResponse {
  id: string;
  reservation: ReservationData;
  companyDetails?: CompanyDetails;
  invoiceCode: string;
  primaryGuest: {
    id: string;
    firstName: string;
    lastName: string;
    contactDetails: { cc: string; contactNumber: string; emailId: string };
    age: number;
    documentRequired: boolean;
  };
  itemList: [
    {
      created: number;
      updated: number;
      id: string;
      description: string;
      unit: number;
      amount: number;
      itemTax: {
        created: number;
        updated: number;
        id: string;
        country: string;
        taxType: string;
        taxValue: number;
        category: string;
        status: boolean;
      }[];
      discount?: {
        type: 'FLAT' | 'PERCENT';
        value: number;
        amount: number;
      };
      billDate: number;
      itemCode: string;
      perUnitPrice: number;
      isAddOn: boolean;
    }
  ];
  invoiceDate: number;
  invoiceGenerated: boolean;
  originalAmount: number;
  invoicePaidAmount: number;
  invoiceDueAmount: number;
  invoiceAmount: number;
  roomNumber: string;
}

type CompanyDetails = {
  id: string;
  companyName: string;
  email: string;
  address: Address;
  contactNumber: string;
  gstNumber: string;
  contactName: string;
};

type Address = {
  created: number;
  updated: number;
  id: string;
  city: string;
  country: string;
  countryCode: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  reservationId: string;
  guestId: string | null;
  guestType: string;
};

type ReservationData = {
  arrivalTime: number;
  departureTime: number;
  number: string;
  stateCompletedSteps: number;
  totalRoomCount: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  invoicePrepareRequest: boolean;
  vip: boolean;
};

export type ItemList = {
  items: Item[];
};

export type Item = {
  id: string;
  created: number;
  updated: number;
  description: string;
  unit: number;
  billDate: number;
  perUnitPrice: number;
  transactionType: string;
  amount: number;
  discount?: Discount;
  itemTax: Tax[];
};

export type Discount = {
  type?: string;
  value?: number;
};

export type Tax = {
  created: number;
  updated: number;
  id: string;
  country: string;
  taxType: string;
  taxValue: number;
  category: string;
  status: boolean;
};

export type PaymentHistoryResponse = {
  id: string;
  amount: number;
  transactionId: string | null;
  status: string;
  reservationId: string | null;
  created: number;
  paymentMethod: string | null;
  remarks: string | null;
};

export type PaymentHistoryListRespone = {
  paymentHistoryData: PaymentHistoryResponse[];
  total: number;
  entityStateCounts: EntityStateCountsResponse;
};

export type EntityStateCountsResponse = {
  ALL: number;
  PAID: number;
  UNPAID: number;
};
