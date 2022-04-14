import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { Amenity, TopicSource } from '../data-models/topicConfig.model';

@Injectable()
export class TopicService extends ApiService {
  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getHotelTopic(config,hotelId) {
    // return this.get(`/api/v1/packages${config.queryObj}`);
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }

  addTopic(hotelId, data){
    return this.post(`/api/v1/entity/${hotelId}/topics`,data);
  }

  mapTopicData(formValue, hotelId, id?) {
    const topicData = new Amenity();
    topicData.active = formValue.active;
    topicData.hotelId = hotelId;
    // topicData.imageUrl = formValue.imageUrl;
    topicData.topicCode = formValue.topicCode;
    topicData.id = id || '';
    topicData.parentId = formValue.category;
    topicData.name = formValue.name;
    topicData.description = formValue.description;
    // topicData.currency = formValue.currency;
    topicData.rate = formValue.rate;
    // topicData.quantity = 0;
    topicData.source = TopicSource.Botshot
    // topicData.startDate = 0;
    // topicData.endDate = 0
    topicData.type = formValue.type;
    // topicData.downloadUrl = '';
    topicData.unit = formValue.unit;
    topicData.autoAccept = formValue.autoAccept;
    return topicData;
  }

}
