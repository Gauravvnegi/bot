import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { Campaign } from '../data-model/campaign.model';

@Injectable()
export class CampaignService extends ApiService {
  getTemplateList(id, config): Observable<any> {
    return this.get(`/api/v1/entity/${id}/templates/${config.queryObj}`);
  }

  /**
   * @function getHotelTemplate get template list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of template lists.
   */
  getHotelTemplate(config, hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/templates${config.queryObj}`);
  }

  /**
   * @function createTemplate create new template record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @returns post api of creating new record.
   */
  createTemplate(hotelId, data) {
    return this.post(`/api/v1/entity/${hotelId}/templates`, data);
  }

  /**
   * @function getTemplateDetails get template record details.
   * @param hotelId dynamically getting hotelId into api.
   * @param templateId dynamically getting templateId into api.
   * @returns get api of template details.
   */
  getTemplateDetails(hotelId, templateId) {
    return this.get(`/api/v1/entity/${hotelId}/templates/${templateId}`);
  }

  /**
   * @function updateTemplate update Templaterecord.
   * @param hotelId dynamically getting hotelId into api.
   * @param templateId dynamically getting templateId into api.
   * @param data getting form input data.
   * @returns put api of update Template record.
   */
  updateTemplate(hotelId, templateId, data) {
    return this.put(`/api/v1/entity/${hotelId}/templates/${templateId}`, data);
  }

  /**
   * @function updateTemplateStatus update status of a template record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param templateId dynamically getting templateId into api.
   * @returns patch api of update status.
   */
  updateTemplateStatus(hotelId, data, templateId) {
    return this.patch(
      `/api/v1/entity/${hotelId}/templates/${templateId}/status`,
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
   * @function mapcampaignData map api data into template form data.
   * @param formValue form key values.
   * @param hotelId hotelId for template table.
   * @param id template id.
   * @returns template data.
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
