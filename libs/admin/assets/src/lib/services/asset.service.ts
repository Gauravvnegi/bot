import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Asset } from '../data-models/assetConfig.model';

@Injectable()
export class AssetService extends ApiService {
  /**
   * @function uploadImage uploading image.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api of upload image.
   */
  uploadImage(entityId, data) {
    return this.post(
      `/api/v1/uploads?folder_name=hotel/${entityId}/static-content/assets`,
      data
    );
  }

  /**
   * @function exportCSV To export CSV report of the table.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export csv report of table.
   */
  exportCSV(config, entityId) {
    return this.get(
      `/api/v1/entity/${entityId}/assets/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   *@function getHotelAsset get asset list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting hotel id.
   * @returns get api of hotel asset.
   */
  getHotelAsset(config: { queryObj: any }, entityId: any) {
    return this.get(`/api/v1/entity/${entityId}/assets${config.queryObj}`);
  }

  /**
   * @function addasset adding new asset record.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api for adding asset.
   */
  addasset(entityId, data) {
    return this.post(`/api/v1/entity/${entityId}/assets`, data);
  }

  /**
   * @function updateAssetStatus updating asset status.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @param assetId dynamically getting asset id.
   * @returns patch api for update asset status.
   */
  updateAssetStatus(entityId, data, assetId) {
    return this.patch(
      `/api/v1/entity/${entityId}/assets/${assetId}/status`,
      data
    );
  }

  /**
   * @function updateAsset updating existing asset data.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @param assetId dynamically getting asset id.
   * @returns put api for update Asset.
   */
  updateAsset(entityId, data, assetId) {
    return this.put(`/api/v1/entity/${entityId}/assets/${assetId}`, data);
  }

  /***
   *  @function getAssetDetails to get the asset details.
   * @param assetId The asset id for which edit action will be done.
   */
  getAssetDetails(entityId, assetId) {
    return this.get(`/api/v1/entity/${entityId}/assets/${assetId}`);
  }

  /**
   * @function mapAssetData map api data into asset form data.
   * @param formValue form key values.
   * @param entityId entityId for asset table.
   * @param id asset id.
   * @returns asset data.
   */
  mapAssetData(formValue, entityId, id?) {
    const assetData = new Asset();
    assetData.active = formValue.status;
    assetData.entityId = entityId;
    assetData.id = formValue.id;
    assetData.name = formValue.name;
    assetData.description = formValue.description;
    assetData.type = formValue.type;
    assetData.url = formValue.url;
    assetData.thumbnailUrl = formValue.thumbnailUrl;
    return assetData;
  }
}
