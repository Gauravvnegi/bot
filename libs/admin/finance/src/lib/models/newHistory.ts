// import {
//     InvoiceHistoryListResponse,
//     InvoiceHistoryResponse,
//   } from '../types/newHistory';
  import { EntityState } from '@hospitality-bot/admin/shared';
import { InvoiceHistoryListResponse, InvoiceHistoryResponse } from '../types/new-data-history';
  
  export class InvoiceHistory {
    pdfUrl:string;
    isRefund:number;
    reservationId:string;
    invoiceDate: number;
    
  
    deserialize(input: InvoiceHistoryResponse) {
     
      this.pdfUrl = input?.pdfUrl ?? '';
      this.invoiceDate = input?.invoiceDate ?? 0;
      this.isRefund = input?.isRefund ?? 0;
      this.reservationId = input?.reservationId ?? '';
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
  
 
  

  