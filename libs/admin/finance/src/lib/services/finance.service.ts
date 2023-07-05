import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableValue } from '../constants/data-table';
import { ApiService } from '@hospitality-bot/shared/utils';
import { map } from 'rxjs/operators';
import { invoiceHistoryRes, transactionHistoryRes } from '../constants/response';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable({
  providedIn: 'root',
})
export class FinanceService extends ApiService {
  selectedTable = new BehaviorSubject<TableValue>(TableValue.ROOM);
  selectedTransactionTable = new BehaviorSubject<TableValue>(TableValue.ROOM);


  getInvoiceHistory(config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/invoices${config.params}`
    )
    // .pipe(
    //   map((res) => {
    //     return invoiceHistoryRes;
    //   })
    // );;
  }

  getTransactionHistory(config?: QueryConfig): Observable<any>  {
    return this.get(
      `/api/v1/payment${config.params}`
    )
    // .pipe(
    //   map((res) => {
    //     return transactionHistoryRes;
    //   })
    // );
  }

  exportCSV(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/outlet/export`, {
      responseType: 'blob',
    });
  }
}
