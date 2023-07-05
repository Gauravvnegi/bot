import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReceiverFields, SendersData } from '../types/campaign.type';

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

  /**
   * @function getFromEmail get email on basis of hotel id.
   * @param entityId dynamically getting entityId.
   * @returns get api for email.
   */
  getFromEmail(entityId: string): Observable<any> {
    return this.get(`/api/v1/configurations/smtp`, { 'entity-id': entityId });
  }
  // getFromEmail(entityId: string): Observable<any> {
  //   return this.get(`/api/v1/hotel/${entityId}/email`);
  // }

  /**
   * @function getTopicList function to get topic list
   * @param id dynamically getting entityId.
   * @returns get api for getting topic list.
   */
  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  /**
   * @function getTemplateByTopic function to get template by topic.
   * @param entityId dynamically getting hotel id.
   * @param topicId dynamically getting topic id.
   * @returns
   */
  getTemplateByTopic(entityId: string, topicId: string) {
    return this.get(`/api/v1/entity/${entityId}/templates/topic/${topicId}`);
  }

  /**
   * @function getAllSubscriberGroup function to get subscribers group.
   * @param entityId dynamically getting hotel id.
   * @returns get api of getting subscribers group.
   */
  getAllSubscriberGroup(entityId: string) {
    return this.get(`/api/v1/marketing/entity/${entityId}/subscription-group`);
  }

  /**
   * @function sendEmail function to send email.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api to send email.
   */
  sendEmail(entityId: string, data) {
    return this.post(`/api/v1/cms/${entityId}/campaign`, {
      ...data,
      isDraft: false,
    });
  }

  /**
   * @function sendTest function to send test email.
   * @param entityId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api of sending test email.
   */
  sendTest(entityId: string, data) {
    return this.post(`/api/v1/cms/${entityId}/campaign/test`, data);
  }

  scheduleCampaign(entityId: string, data) {
    return this.post(`/api/v1/cms/${entityId}/campaign`, data);
  }

  /**
   * @function disableDropdowns function to disable dropdowns.
   */
  disableDropdowns() {
    this.$enableDropdown.to.next(false);
    this.$enableDropdown.cc.next(false);
    this.$enableDropdown.bcc.next(false);
    this.$disablePersonalizationPopup.subject.next(true);
    this.$disablePersonalizationPopup.previewText.next(true);
  }

  /**
   * @function createRequestData function to create request data.
   * @param data data object to form fields.
   */
  createRequestData(data) {
    const reqData = {};
    reqData['to'] = this.mapSendersData('to', data);
    if (data['cc']) reqData['cc'] = data.cc;
    if (data['bcc']) reqData['bcc'] = data.bcc;
    if (data.id.length) reqData['id'] = data.id;
    return {
      ...reqData,
      name: data.name,
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

  createScheduleRequestData(data, time) {
    const reqData = {};
    reqData['to'] = this.mapSendersData('to', data);
    if (data['cc']) reqData['cc'] = data.cc;
    if (data['bcc']) reqData['bcc'] = data.bcc;
    if (data.id.length) reqData['id'] = data.id;
    return {
      ...reqData,
      name: data.name,
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
      dateTime: time,
      isSchedule: true,
    };
  }

  /**
   * @function mapSendersData function to map senders data.
   * @param field different senders fields
   * @param data senders data.
   * @returns
   */
  mapSendersData(field: ReceiverFields, data): SendersData {
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

  /**
   * @function createTestResquestData function to create test request data.
   * @param data data object bind to particular field.
   */
  createTestResquestData(data) {
    const reqData = {};
    reqData['to'] = this.mapSendersData('to', data);
    if (data['cc']) reqData['cc'] = this.mapSendersData('cc', data);
    if (data['bcc']) reqData['bcc'] = this.mapSendersData('bcc', data);
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

  /**
   *@function checkForEmptyForm function to check for empty forms.
   * @param values values object to bind values with individual form fields.
   */
  checkForEmptyForm(values) {
    return (
      values.name.length ||
      values.to.length ||
      values.testEmails.length ||
      values.from.length ||
      values.previewText.length ||
      values.subject.length ||
      values.message.length ||
      (values.cc && values.cc.length) ||
      (values.bcc && values.bcc.length)
    );
  }
}
