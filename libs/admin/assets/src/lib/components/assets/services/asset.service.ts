import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';

@Injectable()
export class AssetService extends ApiService {
  getHotelAsset(config: { queryObj: any }, hotelId: any) {
    return this.get(`/api/v1/entity/${hotelId}/assets${config.queryObj}`);
  }
}
