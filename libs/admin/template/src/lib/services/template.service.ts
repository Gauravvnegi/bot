import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TemplateFormData } from '../constants/template';
import { Template } from '../data-models/templateConfig.model';

@Injectable()
export class TemplateService extends ApiService {
  templateFormData = new BehaviorSubject(<TemplateFormData>{});

  /**
   *@function getTopicList function to get topic list.
   * @param id dynamically getting id into api.
   * @param config dynamically getting global query filter into api.
   * @returns api to get topic list.
   */
  getTopicList(id: string, config): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics/${config.queryObj}`);
  }

  /**
   * @function getTemplateListByTopic function to get template list by topic.
   * @param entityId dynamically getting hotel id into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api for getting template list by topic.
   */
  getTemplateListByTopic(entityId, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/templates/topic${config.queryObj}`
    );
  }

  /**
   * @function getTemplateByTopicId function to get template by particular topic id.
   * @param entityId dynamically getting hotel id into api.
   * @param topicId dynamically getting topic id into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api for getting template list by particular topic id.
   */
  getTemplateListByTopicId(entityId, topicId, config) {
    return this.get(
      `/api/v1/entity/${entityId}/templates/topic/${topicId}${config.queryObj}`
    );
  }

  /**
   * @function getHotelTemplate get template list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of template lists.
   */
  getHotelTemplate(config, entityId) {
    return this.get(`/api/v1/entity/${entityId}/templates${config.queryObj}`);
  }

  /**
   * @function createTemplate create new template record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @returns post api of creating new record.
   */
  createTemplate(entityId, data) {
    return this.post(`/api/v1/entity/${entityId}/templates`, data);
  }

  /**
   * @function getTemplateDetails get template record details.
   * @param entityId dynamically getting entityId into api.
   * @param templateId dynamically getting templateId into api.
   * @returns get api of template details.
   */
  getTemplateDetails(entityId, templateId) {
    return this.get(`/api/v1/entity/${entityId}/templates/${templateId}`);
  }

  /**
   * @function updateTemplate update Templaterecord.
   * @param entityId dynamically getting entityId into api.
   * @param templateId dynamically getting templateId into api.
   * @param data getting form input data.
   * @returns put api of update Template record.
   */
  updateTemplate(entityId, templateId, data) {
    return this.put(`/api/v1/entity/${entityId}/templates/${templateId}`, data);
  }

  /**
   * @function updateTemplateStatus update status of a template record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @param templateId dynamically getting templateId into api.
   * @returns patch api of update status.
   */
  updateTemplateStatus(entityId, data, templateId) {
    return this.patch(
      `/api/v1/entity/${entityId}/templates/${templateId}/status`,
      data
    );
  }

  /**
   * @function exportCSV To export CSV report of the table.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export csv report of table.
   */
  exportCSV(entityId, config) {
    return this.get(
      `/api/v1/entity/${entityId}/templates/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function getAssets function to get Assets.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api for getting assets.
   */
  getAssets(entityId: string, config) {
    return this.get(`/api/v1/entity/${entityId}/assets${config.queryObj}`);
  }

  /**
   * @function deleteTemplateContent function to delete template content.
   * @param entityId dynamically getting entity id into api.
   * @param id dynamically getting id into api.
   * @returns delete api for deleting template content.
   */
  deleteTemplateContent(entityId: string, id: string) {
    return this.delete(`/api/v1/entity/${entityId}/templates/${id}`);
  }

  /**
   * @function mapTemplateData map api data into template form data.
   * @param formValue form key values.
   * @param entityId entityId for template table.
   * @param id template id.
   * @returns template data.
   */
  mapTemplateData(formValue, entityId, id?) {
    const templateData = new Template();
    templateData.active = formValue.status;
    templateData.entityId = entityId;
    templateData.id = formValue.id;
    templateData.name = formValue.name;
    templateData.description = formValue.description;
    templateData.topicId = formValue.topicId;
    templateData.topicName = formValue.topicName;
    templateData.templateType = formValue.templateType;
    templateData.htmlTemplate = formValue.htmlTemplate;
    templateData.isShared = formValue.isShared;
    return templateData;
  }
}
