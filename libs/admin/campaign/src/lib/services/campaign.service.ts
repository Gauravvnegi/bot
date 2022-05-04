import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Campaign } from '../data-model/campaign.model';

@Injectable()
export class CampaignService extends ApiService {
  getlisting: any;
  /**
   * @function getHotelCampaign get campaign list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of campaign lists.
   */
  getHotelCampaign(config, hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/templates${config.queryObj}`);
  }

  /**
   * @function createCampaign create new campaign record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @returns post api of creating new record.
   */
  createCampaign(hotelId, data) {
    return this.post(`/api/v1/entity/${hotelId}/templates`, data);
  }

  /**
   * @function getCampaignDetails get campaign record details.
   * @param hotelId dynamically getting hotelId into api.
   * @param campaignId dynamically getting campaignId into api.
   * @returns get api of campaign details.
   */
  getCampaignDetails(hotelId, campaignId) {
    return this.get(`/api/v1/entity/${hotelId}/templates/${campaignId}`);
  }

  /**
   * @function updateCampaign update Campaign record.
   * @param hotelId dynamically getting hotelId into api.
   * @param campaignId dynamically getting campaignId into api.
   * @param data getting form input data.
   * @returns put api of update Campaign record.
   */
  updateCampaign(hotelId, campaignId, data) {
    return this.put(`/api/v1/entity/${hotelId}/templates/${campaignId}`, data);
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
      `/api/v1/entity/${hotelId}/templates/${campaignId}/status`,
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
      `/api/v1/entity/${hotelId}/templates/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function mapcampaignData map api data into campaign form data.
   * @param formValue form key values.
   * @param hotelId hotelId for campaign table.
   * @param id campaign id.
   * @returns campaign data.
   */
  mapcampaignData(formValue, hotelId, id?) {
    const campaignData = new Campaign();
    campaignData.active = formValue.status;
    campaignData.hotelId = hotelId;
    campaignData.id = formValue.id;
    campaignData.name = formValue.name;
    campaignData.description = formValue.description;
    campaignData.topicId = formValue.topicId;
    campaignData.templateType = formValue.templateType;
    campaignData.htmlTemplate = formValue.htmlTemplate;
    return campaignData;
  }
}
