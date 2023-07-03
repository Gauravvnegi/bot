export type QueryConfig = {
  params: string;
};

export type BillItem = {
  id: string;
  date: number;
  description: string;
  unit: number;
  creditAmount: number;
  debitAmount: number;
  transactionType: 'DEBIT' | 'CREDIT';
  itemCode?: string;
  isAddOn?: boolean;
  itemId?: string;
  taxId?: string;
  isCoupon?: boolean;
};

export type CompanyDetails = {
  gstNumber: string;
  contactNumber: string;
  email: string;
  companyName: string;
  id: string;
  address: {
    city: string;
    country: string;
    countryCode: string;
    state: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string;
    reservationId: string;
    guestId: string;
    guestType: string;
  };
};

export type BillSummaryData = {
  billItems: BillItem[];
  companyDetails: CompanyDetails;
  cashier: string;
  remarks: string;
  deleteInvoiceItems: string[];
  totalAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
  invoiceCode: string;
  invoiceGenerated: boolean;
  invoiceDate: number;
  pdfUrl: string;
};
