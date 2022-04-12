import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';

@Injectable()
export class AssetService extends ApiService {
  getHotelAsset(config) {
    return this.get(`/api/v1/packages${config.queryObj}`);
  }
}
