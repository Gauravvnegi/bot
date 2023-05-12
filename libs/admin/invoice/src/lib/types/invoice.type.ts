export type QueryConfig = {
  params: string;
};

export type InvoiceData = {
  id: string;
  companyDetails: {
    id: string;
    gstNumber: string;
    companyName: string;
    email: string;
    contactNumber: string;
    address: {
      city: string;
      country: string;
      postalCode: string;
      countryCode: string;
      addressLine1: string;
      addressLine2?: string;
      state: string;
      reservationId: string;
      guestId: string;
      guestType: string;
    };
  };
  payment: {
    entityId: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: 'FAILURE' | 'SUCCESS';
    orderId: string;
    payOnDesk: boolean;
    paymentMode: string;
    reservationId: string;
  };
  invoiceItems: [
    {
      itemId?: string; // in case of new addition
      id?: string; // in case of update
      unit: number;
      unitValue: number;
      discountType?: 'FLAT' | 'PERCENT';
      discountValue?: number;
    }
  ];
  deleteInvoiceItems?: string[];
};
