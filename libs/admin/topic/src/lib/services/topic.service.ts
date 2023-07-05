import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Topic } from '../data-models/topicConfig.model';

@Injectable()
export class TopicService extends ApiService {
  /**
   * @function getTopicDetails get topic record details.
   * @param entityId dynamically getting entityId into api.
   * @param topicId dynamically getting topicId into api.
   * @returns get api of topic details.
   */
  getTopicDetails(entityId, topicId) {
    return this.get(`/api/v1/entity/${entityId}/topics/${topicId}`);
  }

  /**
   * @function getHotelTopic get topic list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of topic lists.
   */
  getHotelTopic(config, entityId) {
    return this.get(`/api/v1/entity/${entityId}/topics${config.queryObj}`);
  }

  /**
   * @function addTopic add new topic record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @returns post api of adding new record.
   */
  addTopic(entityId, data) {
    return this.post(`/api/v1/entity/${entityId}/topics`, data);
  }

  /**
   * @function updateTopicStatus update status of a topic record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @param topicId dynamically getting topicId into api.
   * @returns patch api of update status.
   */
  updateTopicStatus(entityId, data, topicId) {
    return this.patch(
      `/api/v1/entity/${entityId}/topics/${topicId}/status`,
      data
    );
  }

  /**
   * @function updateTopic update topic record.
   * @param entityId dynamically getting entityId into api.
   * @param topicId dynamically getting topicId into api.
   * @param data getting form input data.
   * @returns put api of update topic record.
   */
  updateTopic(entityId, topicId, data) {
    return this.put(`/api/v1/entity/${entityId}/topics/${topicId}`, data);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export csv report of table.
   */
  exportCSV(entityId, config) {
    return this.get(
      `/api/v1/entity/${entityId}/topics/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function mapTopicData map api data into topic form data.
   * @param formValue form key values.
   * @param entityId entityId for topic table.
   * @param id topic id.
   * @returns topic data.
   */
  mapTopicData(formValue, entityId, id?) {
    const topicData = new Topic();
    topicData.active = formValue.status;
    topicData.entityId = entityId;
    topicData.id = formValue.id;
    topicData.name = formValue.name;
    topicData.description = formValue.description;
    return topicData;
  }
}
