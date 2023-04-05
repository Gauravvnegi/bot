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

    currentAmount: number;
    discountedAmount: number;
    totalDiscount: number;
    paidAmount: number;
    dueAmount: number;

    discountType: string;
    discount: number;

    paidValue: number;
    paid: number;
  };
  
  export type PaymentField = {
    description: string;
    unit: number;
    unitPrice: number;
    amount: number;
    tax: string;
    totalAmount: number;
  };


  