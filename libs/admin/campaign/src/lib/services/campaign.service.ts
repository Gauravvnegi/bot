import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Campaign } from '../data-model/campaign.model';

@Injectable()
export class CampaignService extends ApiService {
  getListings(hotelId: string, config) {
    return this.get(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }

  /**
   * @function getHotelCampaign get campaign list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of campaign lists.
   */
  getHotelCampaign(config, hotelId) {
    return this.get(`/api/v1/cms/${hotelId}/campaign${config.queryObj}`);
  }

  /**
   * @function updateCampaignStatus update status of a campaign record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns patch api of update status.
   */
  updateCampaignStatus(hotelId, data, campaignId) {
    return this.patch(
      `/api/v1/cms/${hotelId}/campaign/${campaignId}/toggle`,
      data
    );
  }

  cloneCampaign(hotelId, data, campaignId) {
    return this.post(
      `/api/v1/cms/${hotelId}/campaign/${campaignId}/clone`,
      data
    );
  }

  archiveCampaign(hotelId, data, campaignId) {
    return this.patch(
      `/api/v1/cms/${hotelId}/campaign/${campaignId}/archieve`,
      data
    );
  }
  /**
   * @function exportCSV To export CSV report of the table.
   * @param hotelId dynamically getting hotelId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export csv report of table.
   */
  exportCSV(hotelId, config) {
    return this.get(
      `/api/v1/cms/${hotelId}/campaign/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }
  getCampaignById(entityId: string, campaignId: string) {
    return this.get(`/api/v1/cms/${entityId}/campaign/${campaignId}`);
  }

  getTemplateByContentType(entityId: string, config) {
    return this.get(
      `/api/v1/entity/${entityId}/templates/topic${config.queryObj}`
    );
  }

  /**
   * @function mapcampaignData map api data into campaign form data.
   * @param formValue form key values.
   * @param hotelId hotelId for campaign table.
   * @param id campaign id.
   * @returns campaign data.
   */
  mapCampaignData(formValue, hotelId, id?) {
    const campaignData = new Campaign();
    campaignData.id = formValue.id;
    campaignData.active = formValue.status;
    campaignData.hotelId = hotelId;
    campaignData.name = formValue.name;
    campaignData.templateName = formValue.templateName;
    campaignData.isDraft = formValue.isDraft;

    return campaignData;
  }

  createCampaignData(values) {}
}
