import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable, Subject } from 'rxjs';
import { OrderListResponse } from '../types/kot-card.type';
import { PendingItemListResponse } from '../types/pending-item.summary.type';

@Injectable()
export class KotService extends ApiService {
  refreshData = new Subject<boolean>();

  getKotList(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/kot${config.params}`);
  }

  getAllOrders(
    entityId: string,
    config: QueryConfig
  ): Observable<OrderListResponse> {
    return this.get(`/api/v1/entity/${entityId}/order${config?.params}`);
  }

  updateOrder(
    entityId: string,
    orderId: string,
    data: { kots: { id: string; status: 'PREPARED' | 'PREPARING' }[] }
  ): Observable<any> {
    return this.patch(`/api/v1/entity/${entityId}/order/${orderId}`, data);
  }

  getPendingItemSummary(entityId: string): Observable<PendingItemListResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/kot?status=PREPARING&includeSummaryItem=true`
    );
  }
}
