import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableValue } from '../constants/data-table';
import { ApiService } from '@hospitality-bot/shared/utils';
import { map } from 'rxjs/operators';
import {
  invoiceHistoryRes,
  transactionHistoryRes,
} from '../constants/response';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable({
  providedIn: 'root',
})
export class FinanceService extends ApiService {
  selectedTable = new BehaviorSubject<TableValue>(TableValue.ROOM);
  selectedTransactionTable = new BehaviorSubject<TableValue>(TableValue.ROOM);

  getInvoiceHistory(config?: QueryConfig): Observable<any> {
    return this.get(`/api/v1/invoices${config.params}`);
  
  }

  getTransactionHistory(config?: QueryConfig): Observable<any> {
    return this.get(`/api/v1/payment${config.params}`);
  
  }

  exportCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/payment/export${config.params}`, {
      responseType: 'blob',
    });
  }

  exportInvoiceCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/invoices/export${config.params}`, {
      responseType: 'blob',
    });
  }
}
