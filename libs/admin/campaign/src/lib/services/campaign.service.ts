import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import {
  CampaignType,
  PostCampaignForm,
  QueryConfig,
  TemplateType,
} from '../types/campaign.type';
import { map } from 'rxjs/operators';
import { Topics } from 'libs/admin/listing/src/lib/data-models/listing.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { CampaignResponse } from '../types/campaign.response';

@Injectable()
export class CampaignService extends ApiService {
  campaignType: CampaignType;

  templateData = new BehaviorSubject<TemplateType>(null);

  mapTopicList(entityId: string) {
    return this.getTopicList(entityId, {
      queryObj: '?entityState=ACTIVE',
    }).pipe(
      map((response) => {
        const data = new Topics()
          .deserialize(response)
          .records.map((item) => ({ label: item.name, value: item.id }));
        return data;
      })
    );
  }

  createCampaign(entityId: string, formData: PostCampaignForm) {
    return this.post(`/api/v1/cms/${entityId}/campaign`, formData);
  }

  updateCampaign(
    entityId: string,
    formData: PostCampaignForm,
    campaignId: string
  ) {
    return this.patch(
      `/api/v1/cms/${entityId}/campaign/${campaignId}`,
      formData
    );
  }

  /**
   * @function getTopicList to get topic list.
   * @param id dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of topic list.
   */
  getTopicList(id: string, config: QueryConfig) {
    return this.get(`/api/v1/entity/${id}/topics${config.queryObj}`);
  }

  /**
   * @function getHotelTemplate get template list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of template lists.
   */
  getHotelTemplate(config: QueryConfig, entityId: string) {
    return this.get(`/api/v1/entity/${entityId}/templates${config.queryObj}`);
  }

  /**
   * @function getListings to get listing data.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api to get listing.
   */
  getListings(entityId: string, config: QueryConfig) {
    return this.get(
      `/api/v1/marketing/entity/${entityId}/listing${config.queryObj}`
    );
  }

  /**
   * @function getHotelCampaign get campaign list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of campaign lists.
   */
  getHotelCampaign(config: QueryConfig, entityId: string) {
    return this.get(`/api/v1/cms/${entityId}/campaign${config.queryObj}`);
  }

  /**
   * @function updateCampaignStatus update status of a campaign record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns patch api of update status.
   */
  updateCampaignStatus(entityId: string, data, campaignId: string) {
    return this.patch(
      `/api/v1/cms/${entityId}/campaign/${campaignId}/toggle`,
      data
    );
  }

  /**
   * @function cloneCampaign function to clone campaign.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns post api for cloning campaign.
   */
  cloneCampaign(entityId: string, data, campaignId: string) {
    return this.post(
      `/api/v1/cms/${entityId}/campaign/${campaignId}/clone`,
      data
    );
  }

  /**
   * @function archiveCampaign function to archive campaign.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaignId into api.
   * @returns patch api for archive campaign.
   */
  archiveCampaign(entityId: string, data, campaignId: string) {
    return this.patch(
      `/api/v1/cms/${entityId}/campaign/${campaignId}/archieve`,
      data
    );
  }
  /**
   * @function exportCSV To export CSV report of the table.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export csv report of table.
   */
  exportCSV(entityId: string, config: QueryConfig) {
    return this.get(`/api/v1/cms/${entityId}/campaign${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  /**
   * @function getCampaignById to get campaign data by id.
   * @param entityId dynamically getting entityId into api.
   * @param campaignId dynamically getting campaignId into api.
   * @returns get api for getting campaign by id.
   */
  getCampaignById(
    entityId: string,
    campaignId: string
  ): Observable<CampaignResponse> {
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
   * @param entityId dynamically getting hotel id.
   * @param topicId dynamically getting topic id.
   * @param config dynamically getting global query filter into api.
   * @returns get api of getting tempate by topic id.
   */
  getTemplateListByTopicId(
    entityId: string,
    topicId: string,
    config: QueryConfig
  ) {
    return this.get(
      `/api/v1/entity/${entityId}/templates/topic/${topicId}${config.queryObj}`
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
   * @param entityId dynamically getting hotel id.
   * @returns get api of getting list by id.
   */
  getListById(id: string, entityId: string) {
    return this.get(`/api/v1/marketing/entity/${entityId}/listing/${id}`);
  }

  /**
   * @function save function to save campaign created
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @param campaignId dynamically getting campaign id.
   * @returns patch api for saving data and post api add data.
   */
  save(entityId: string, data, campaignId?) {
    if (campaignId) {
      return this.patch(`/api/v1/cms/${entityId}/campaign/${campaignId}`, data);
    }
    return this.post(`/api/v1/cms/${entityId}/campaign?isDraft=true`, {
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
