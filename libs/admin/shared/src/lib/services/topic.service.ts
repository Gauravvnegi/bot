import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';

@Injectable({ providedIn: 'root' })
export class TopicService extends ApiService {
  /**
   * @function getHotelTopic get topic list from api.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of topic lists.
   */
  getHotelTopic(config, hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }
}
