import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import {
  ChannelManagerResponse,
  UpdateInventoryResponse,
  UpdateRatesResponse,
} from '../types/response.type';
import { UpdateRatesType } from '../types/channel-manager.types';

@Injectable()
export class ChannelManagerService extends ApiService {
  getChannelManagerDetails<
    T extends UpdateInventoryResponse | UpdateRatesResponse
  >(
    entityId,
    config?: QueryConfig
  ): Observable<{
    roomTypes: T[];
  }> {
    return this.get(`/api/v1/entity/${entityId}/inventory${config?.params}`);
  }

  updateChannelManager(
    data,
    entityId,
    config?: QueryConfig
  ): Observable<ChannelManagerResponse> {
    return this.put(
      `/api/v1/entity/${entityId}/inventory${config?.params}`,
      data
    );
  }

  getRoomDetails(entityId) {
    return this.get(
      `/api/v1/entity/${entityId}/inventory?roomTypeStatus=true&type=ROOM_TYPE&offset=0&limit=${200}`
    );
  }

  getDynamicPricing(
    entityId,
    config?: QueryConfig
  ): Observable<{ roomType: UpdateRatesType }> {
    return this.get(`/api/v1/entity/${entityId}/inventory${config.params}`);
  }
}
