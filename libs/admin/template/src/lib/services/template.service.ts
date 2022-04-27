import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { Template } from '../data-models/templateConfig.model';

@Injectable()
export class TemplateService extends ApiService {

getTopicList(id: string, config): Observable<any> {
  return this.get(`/api/v1/entity/${id}/topics/${config.queryObj}`);
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
   * @function mapTemplateData map api data into template form data.
   * @param formValue form key values.
   * @param hotelId hotelId for template table.
   * @param id template id.
   * @returns template data.
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
