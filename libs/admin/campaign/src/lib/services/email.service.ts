import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EmailService extends ApiService {
  $enableDropdown = {
    to: new BehaviorSubject(false),
    cc: new BehaviorSubject(false),
    bcc: new BehaviorSubject(false),
  };
  $disableField = new BehaviorSubject(false);
  $disablePersonalizationPopup = {
    subject: new BehaviorSubject(false),
    previewText: new BehaviorSubject(false),
  };
  getFromEmail(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/email`);
  }

  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getTemplateByTopic(hotelId: string, topicId: string) {
    return this.get(`/api/v1/entity/${hotelId}/templates/topic/${topicId}`);
  }

  sendEmail(hotelId: string, data) {
    return this.post(`/api/v1/cms/${hotelId}/campaign`, {
      ...data,
      isDraft: false,
    });
  }

  sendTest(hotelId: string, data) {
    return this.post(`/api/v1/cms/${hotelId}/campaign/test`, data);
  }

  disableDropdowns() {
    this.$enableDropdown.to.next(false);
    this.$enableDropdown.cc.next(false);
    this.$enableDropdown.bcc.next(false);
    this.$disablePersonalizationPopup.subject.next(true);
    this.$disablePersonalizationPopup.previewText.next(true);
  }

  createRequestData(campaign, data) {
    const reqData = {};
    reqData['to'] = this.mapSendersData('to', data);
    if (data['cc']) this.mapSendersData('cc', data);
    if (data['bcc']) this.mapSendersData('bcc', data);
    return {
      ...reqData,
      name: campaign?.name,
      topicId: data.topicId,
      from: data.from,
      subject: {
        text: data.subject,
      },
      previewText: data.previewText,
      message: data.message,
      templateId: data.templateId,
      campaignType: data.campaignType,
      testEmails: data.testEmails,
      isDraft: data.isDraft,
    };
  }

  mapSendersData(field, data) {
    const reqData = {
      subscribers: [],
      listing: [],
      individual: [],
    };
    data[field]?.forEach((item) => {
      if (item.type === 'email') reqData.individual.push(item.data.name);
      else if (item.type === 'listing') reqData.listing.push(item.data.id);
      else reqData.subscribers.push(item.data.id);
    });
    return reqData;
  }

  createTestResquestData(data) {
    const reqData = {};
    reqData['to'] = this.mapSendersData('to', data);
    if (data['cc']) this.mapSendersData('cc', data);
    if (data['bcc']) this.mapSendersData('bcc', data);
    return {
      ...reqData,
      topicId: data.topicId,
      from: data.from,
      subject: {
        text: data.subject,
      },
      previewText: data.previewText,
      message: data.message,
      templateId: data.templateId,
      campaignType: data.campaignType,
      testEmails: data.testEmails,
      isDraft: data.isDraft,
    };
  }
}
