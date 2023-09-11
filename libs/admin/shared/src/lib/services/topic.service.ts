import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';

@Injectable({ providedIn: 'root' })
export class TopicService extends ApiService {
  /**
   * @function getHotelTopic get topic list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of topic lists.
   */
  getHotelTopic(config, entityId) {
    return this.get(`/api/v1/entity/${entityId}/topics${config.queryObj}`);
  }
}
