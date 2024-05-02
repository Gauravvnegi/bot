export type TransactionStatus = 'PAID' | 'REFUND' | 'FAILED';

export type InvoiceHistoryResponse = {
  invoiceDate: number;
  pdfUrl: string;
  bookingNumber: string;
  isRefund:number;
  refund:number;
  reservationId:string;
};

export type InvoiceHistoryListResponse = {
  records: InvoiceHistoryResponse[];
  total: number;
};




