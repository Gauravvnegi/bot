import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Amenity } from '../../../data-models/assetConfig.model';

@Injectable()
export class AssetService extends ApiService {
  uploadImage(hotelId, data) {
    return this.post(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/static-content/assets`,
      data
    );
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

  getAssetDetails(hotelId, assetId) {
    return this.get(`/api/v1/entity/${hotelId}/assets/${assetId}`);
  }

  updateAsset(hotelId, data, assetId) {
    return this.put(`/api/v1/entity/${hotelId}/assets/${assetId}`, data);
  }

  mapAssetData(formValue, hotelId, id?) {
    const assetData = new Amenity();
    assetData.active = formValue.status;
    assetData.hotelId = hotelId;
    assetData.imageUrl = formValue.imageUrl;
    // assetData.assetCode = formValue.assetCode;
    assetData.id = id || '';
    assetData.parentId = formValue.category;
    assetData.name = formValue.name;
    assetData.description = formValue.description;
    // assetData.currency = formValue.currency;
    // assetData.rate = formValue.rate;
    // assetData.quantity = 0;
    // assetData.source = assetSource.Botshot;
    // assetData.startDate = 0;
    // assetData.endDate = 0;
    assetData.type = formValue.type;
    assetData.downloadUrl = '';
    assetData.unit = formValue.unit;
    return assetData;
  }
}
