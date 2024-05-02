
import {
  InvoiceHistoryListResponse,
  InvoiceHistoryResponse,
} from '../types/history';

export class InvoiceHistory {
  
  invoiceDate: number;
  pdfUrl: string;
  isRefund: boolean;
  refund: boolean;

  deserialize(input: InvoiceHistoryResponse) {
   
    this.invoiceDate = input?.invoiceDate ?? 0;
    this.pdfUrl = input?.pdfUrl ?? '';
    this.isRefund = input?.invoiceGenerated?? false;
    this.refund = input?.invoiceGenerated?? false;

    return this;
  }
}

export class InvoiceHistoryList {
  records: InvoiceHistory[];
  total: number;

  deserialize(input: InvoiceHistoryListResponse) {
    this.records = input.records?.map((item) =>
      new InvoiceHistory().deserialize(item)
    );
    this.total = input.total;
    return this;
  }
}




