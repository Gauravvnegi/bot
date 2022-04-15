import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { Amenity, TopicSource } from '../data-models/topicConfig.model';

@Injectable()
export class TopicService extends ApiService {
  getTopicDetails(hotelId, packageId) {
    return this.get(`/api/v1/entity/${hotelId}/topics/${packageId}`);
  }
  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getHotelTopic(config,hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }

  addTopic(hotelId, data){
    return this.post(`/api/v1/entity/${hotelId}/topics`,data);
  }

  updateTopicStatus(hotelId, data, topicId){
    console.log(data);
    return this.patch(`/api/v1/entity/${hotelId}/topics/${topicId}/status`,data);
  }

  updateTopic(hotelId, topicId, data) {
    return this.put(`/api/v1/entity/${hotelId}/topics/${topicId}`, data);
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
