import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Asset } from '../data-models/assetConfig.model';

@Injectable()
export class AssetService extends ApiService {
  uploadImage(hotelId, data) {
    return this.post(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/static-content/assets`,
      data
    );
  }


  exportCSV(config,hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/assets/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }
  getHotelAsset(config: { queryObj: any }, hotelId: any) {
    return this.get(`/api/v1/entity/${hotelId}/assets${config.queryObj}`);
  }

  addasset(hotelId, data) {
    return this.post(`/api/v1/entity/${hotelId}/assets`, data);
  }

  updateAssetStatus(hotelId, data, assetId) {
    return this.patch(
      `/api/v1/entity/${hotelId}/assets/${assetId}/status`,
      data
    );
  }
  updateAsset(hotelId, data, assetId) {
    return this.put(`/api/v1/entity/${hotelId}/assets/${assetId}`, data);
  }

  getAssetDetails(hotelId, assetId) {
    return this.get(`/api/v1/entity/${hotelId}/assets/${assetId}`);
  }


  mapAssetData(formValue, hotelId, id?) {
    const assetData = new Asset();
    assetData.active = formValue.status;
    assetData.hotelId = hotelId;
    assetData.imageUrl = formValue.imageUrl;
    assetData.id = formValue.id;
    assetData.name = formValue.name;
    assetData.description = formValue.description;
    assetData.type = formValue.type;
    return assetData;
  }
}
