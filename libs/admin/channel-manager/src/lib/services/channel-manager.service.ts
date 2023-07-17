import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { ChannelManagerResponse } from '../types/response.type';

@Injectable()
export class ChannelManagerService extends ApiService {
  getChannelManagerDetails(
    entityId,
    type: 'inventory' | 'rates',
    config?: QueryConfig
  ): Observable<{ roomType: ChannelManagerResponse }> {
    return this.get(`/api/v1/entity/${entityId}/${type}${config?.params}`);
  }

  updateChannelManager(
    data,
    entityId,
    type: 'inventory' | 'rates',
    config?: QueryConfig
  ): Observable<any> {
    return this.put(
      `/api/v1/entity/${entityId}/${type}${config?.params}`,
      data
    );
  }
}
