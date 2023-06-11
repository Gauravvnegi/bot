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


  getInvoiceHistory(hotelId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return invoiceHistoryRes;
      })
    );;
  }

  getTransactionHistory(hotelId: string, config?: QueryConfig): Observable<any>  {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return transactionHistoryRes;
      })
    );;
  }

  exportCSV(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/outlet/export`, {
      responseType: 'blob',
    });
  }
}
