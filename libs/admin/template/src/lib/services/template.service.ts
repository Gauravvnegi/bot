import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Template } from '../data-models/templateConfig.model';

@Injectable()
export class TemplateService extends ApiService {
  /**
   * @function getHotelTopic get template list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of template lists.
   */
  getHotelTemplate(config, hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }

  /**
   * @function updateTopicStatus update status of a topic record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param topicId dynamically getting topicId into api.
   * @returns patch api of update status.
   */
  updateTemplateStatus(hotelId, data, templateId) {
    return this.patch(
      `/api/v1/entity/${hotelId}/topics/${templateId}/status`,
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
      `/api/v1/entity/${hotelId}/topics/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function mapTopicData map api data into topic form data.
   * @param formValue form key values.
   * @param hotelId hotelId for topic table.
   * @param id topic id.
   * @returns topic data.
   */
  mapTemplateData(formValue, hotelId, id?) {
    const templateData = new Template();
    templateData.active = formValue.status;
    templateData.hotelId = hotelId;
    templateData.id = formValue.id;
    templateData.name = formValue.name;
    templateData.description = formValue.description;
    return templateData;
  }
}
