import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Campaign } from '../data-model/campaign.model';
import { QueryConfig } from '../types/campaign.type';

@Injectable()
export class CampaignService extends ApiService {
  /**
   * @function getTopicList to get topic list.
   * @param id dynamically getting hotelId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of topic list.
   */
  getTopicList(id: string, config: QueryConfig) {
    return this.get(`/api/v1/entity/${id}/topics/${config.queryObj}`);
  }

  /**
   * @function getListings to get listing data.
   * @param hotelId dynamically getting hotelId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api to get listing.
   */
  getListings(hotelId: string, config: QueryConfig) {
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
  getHotelCampaign(config: QueryConfig, hotelId: string) {
    return this.get(`/api/v1/cms/${hotelId}/campaign${config.queryObj}`);
  }

  /**
   * @function updateCampaignStatus update status of a campaign record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns patch api of update status.
   */
  updateCampaignStatus(hotelId: string, data, campaignId: string) {
    return this.patch(
      `/api/v1/cms/${hotelId}/campaign/${campaignId}/toggle`,
      data
    );
  }

  /**
   * @function cloneCampaign function to clone campaign.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns post api for cloning campaign.
   */
  cloneCampaign(hotelId: string, data, campaignId: string) {
    return this.post(
      `/api/v1/cms/${hotelId}/campaign/${campaignId}/clone`,
      data
    );
  }

  /**
   * @function archiveCampaign function to archive campaign.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns patch api for archive campaign.
   */
  archiveCampaign(hotelId: string, data, campaignId: string) {
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
  exportCSV(hotelId: string, config: QueryConfig) {
    console.log('config', config);
    return this.get(
      `/api/v1/cms/${hotelId}/campaign/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function getCampaignById to get campaign data by id.
   * @param entityId dynamically getting entityId into api.
   * @param campaignId dynamically getting campaignId into api.
   * @returns get api for getting campaign by id.
   */
  getCampaignById(entityId: string, campaignId: string) {
    return this.get(`/api/v1/cms/${entityId}/campaign/${campaignId}`);
  }

  /**
   * @function getTemplateByContentType function to get template by content type.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of get template by content type.
   */
  getTemplateByContentType(entityId: string, config: QueryConfig) {
    return this.get(
      `/api/v1/entity/${entityId}/templates/topic${config.queryObj}`
    );
  }

  /**
   * @function getTemplateByTopicId function to get template by topic id.
   * @param hotelId dynamically getting hotel id.
   * @param topicId dynamically getting topic id.
   * @param config dynamically getting global query filter into api.
   * @returns get api of getting tempate by topic id.
   */
  getTemplateListByTopicId(
    hotelId: string,
    topicId: string,
    config: QueryConfig
  ) {
    return this.get(
      `/api/v1/entity/${hotelId}/templates/topic/${topicId}${config.queryObj}`
    );
  }

  /**
   * @function deleteCampaignTemplate function to delete campaign template.
   * @param entityId dynamically getting entityId into api.
   * @param campaignId dynamically getting campaignId into api.
   * @returns get api of deleting campaign template.
   */
  deleteCampaignTemplate(entityId: string, campaignId: string) {
    return this.get(`/api/v1/cms/${entityId}/campaign/${campaignId}`);
  }

  /**
   * @function getListById function to get listing by id.
   * @param id dynamically getting id.
   * @param hotelId dynamically getting hotel id.
   * @returns get api of getting list by id.
   */
  getListById(id: string, hotelId: string) {
    return this.get(`/api/v1/marketing/entity/${hotelId}/listing/${id}`);
  }

  /**
   * @function save function to save campaign created
   * @param hotelId dynamically getting hotel id.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaign id.
   * @returns patch api for saving data and post api add data.
   */
  save(hotelId: string, data, campaignId?) {
    if (campaignId) {
      return this.patch(`/api/v1/cms/${hotelId}/campaign/${campaignId}`, data);
    }
    return this.post(`/api/v1/cms/${hotelId}/campaign?isDraft=true`, {
      ...data,
      isDraft: true,
    });
  }

  /**
   * @function getReceiversFromData function to get receiver from data.
   * @param receivers type of receivers.
   * @returns data
   */
  getReceiversFromData(receivers) {
    const data = [];
    receivers.individual?.forEach((item) => {
      data.push({
        data: { name: item.name },
        type: 'email',
      });
    });

    receivers.listing?.forEach((item) =>
      data.push({
        data: { id: item.receiverId, name: item.name },
        type: 'listing',
      })
    );

    receivers.subscribers?.forEach((item) =>
      data.push({
        data: { id: item.receiverId, name: item.name },
        type: 'subscribers',
      })
    );
    return data;
  }

  /**
   * @function searchReceivers function to search receiver.
   * @param entityId entityId dynamically getting entityId into api.
   * @param searchKey search on the basis of key.
   * @returns get api of search receiver.
   */
  searchReceivers(entityId, searchKey) {
    return this.get(
      `/api/v1/marketing/entity/${entityId}/search?key=${searchKey}`
    );
  }
}
