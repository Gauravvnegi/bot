export type InvoiceForm = {
    invoiceNumber: string;
    confirmationNumber: string;
    guestName: string;
    companyName: string;
    invoiceDate: string;
    arrivalDate: string;
    departureDate: string;
    roomNumber: string;
    roomType: string;
    adults: string;
    children: string;
  };
  
  export type PaymentField = {
    description: string;
    unit: number;
    unitPrice: number;
    amount: number;
    tax: string;
    totalAmount: number;
  };
  
  export type PaymentForm = {
    table: {
      de;
    };
  };
  