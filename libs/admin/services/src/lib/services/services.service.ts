import { Injectable } from '@angular/core';
import { LibraryService, QueryConfig } from '@hospitality-bot/admin/library';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TableValue } from '../constant/data-table';
import { TaxListResponse } from '../types/response';
import { EventEmitter } from 'events';
import { ServiceFormData } from '../types/service';

@Injectable()
export class ServicesService extends LibraryService {
  entityId: string;

  serviceFormData = new BehaviorSubject<ServiceFormData>(null);

  /**
   * Currently Selected Services table
   * It can either be 'ALL' | 'PAID' | 'COMPLIMENTARY'
   */
  selectedTable = new BehaviorSubject<TableValue>(TableValue.ALL);

  getTaxList(
    entityId: string,
    config: QueryConfig = { params: `?entityId=${entityId}&limit=0&offset=0` }
  ): Observable<TaxListResponse> {
    return this.get(`/api/v1/tax${config?.params ?? ''}`);
  }
}
