import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Topic } from '../data-models/templateConfig.model';

@Injectable()
export class TemplateService extends ApiService {
  /**
   * @function getTopicDetails get topic record details.
   * @param hotelId dynamically getting hotelId into api.
   * @param topicId dynamically getting topicId into api.
   * @returns get api of topic details.
   */
  getTopicDetails(hotelId, topicId) {
    return this.get(`/api/v1/entity/${hotelId}/topics/${topicId}`);
  }

  /**
   * @function getHotelTopic get topic list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of topic lists.
   */
  getHotelTopic(config, hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }

  /**
   * @function addTopic add new topic record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @returns post api of adding new record.
   */
  addTopic(hotelId, data) {
    return this.post(`/api/v1/entity/${hotelId}/topics`, data);
  }

  /**
   * @function updateTopicStatus update status of a topic record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @param topicId dynamically getting topicId into api.
   * @returns patch api of update status.
   */
  updateTopicStatus(hotelId, data, topicId) {
    return this.patch(
      `/api/v1/entity/${hotelId}/topics/${topicId}/status`,
      data
    );
  }

  /**
   * @function updateTopic update topic record.
   * @param hotelId dynamically getting hotelId into api.
   * @param topicId dynamically getting topicId into api.
   * @param data getting form input data.
   * @returns put api of update topic record.
   */
  updateTopic(hotelId, topicId, data) {
    return this.put(`/api/v1/entity/${hotelId}/topics/${topicId}`, data);
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
  mapTopicData(formValue, hotelId, id?) {
    const topicData = new Topic();
    topicData.active = formValue.status;
    topicData.hotelId = hotelId;
    topicData.id = formValue.id;
    topicData.name = formValue.name;
    topicData.description = formValue.description;
    return topicData;
  }
}
