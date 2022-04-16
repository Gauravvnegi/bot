import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Topic } from '../data-models/topicConfig.model';

@Injectable()
export class TopicService extends ApiService {

  /**
   * get existing topic record details
   * @param hotelId 
   * @param packageId 
   * @returns topics details
   */
  getTopicDetails(hotelId, topicId) {
    return this.get(`/api/v1/entity/${hotelId}/topics/${topicId}`);
  }

  /**
   * get topic list from get api
   * @param config 
   * @param hotelId 
   * @returns topic list
   */
  getHotelTopic(config,hotelId) {
    return this.get(`/api/v1/entity/${hotelId}/topics${config.queryObj}`);
  }

  /**
   * add new topic record  
   * @param hotelId 
   * @param data 
   * @returns add record
   */
  addTopic(hotelId, data){
    return this.post(`/api/v1/entity/${hotelId}/topics`,data);
  }

  /**
   * change topic status (active/deactive)
   * @param hotelId 
   * @param data 
   * @param topicId 
   * @returns update topic status
   */
  updateTopicStatus(hotelId, data, topicId){
    return this.patch(`/api/v1/entity/${hotelId}/topics/${topicId}/status`,data);
  }

  /**
   * edit existing topic record
   * @param hotelId 
   * @param topicId 
   * @param data 
   * @returns update record
   */
  updateTopic(hotelId, topicId, data) {
    return this.put(`/api/v1/entity/${hotelId}/topics/${topicId}`, data);
  }

  mapTopicData(formValue, hotelId, id?) {
    const topicData = new Topic();
    topicData.status = formValue.status;
    topicData.hotelId = hotelId;
    topicData.id = id || '';
    topicData.name = formValue.name;
    topicData.description = formValue.description;
    return topicData;
  }

}
