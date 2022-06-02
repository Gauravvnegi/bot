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

  /**
   * @function getFromEmail get email on basis of hotel id.
   * @param hotelId dynamically getting hotelId.
   * @returns get api for email.
   */
  getFromEmail(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/email`);
  }

  /**
   * @function getTopicList function to get topic list
   * @param id dynamically getting hotelId.
   * @returns get api for getting topic list.
   */
  getTopicList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  /**
   * @function getTemplateByTopic function to get template by topic.
   * @param hotelId dynamically getting hotel id.
   * @param topicId dynamically getting topic id.
   * @returns
   */
  getTemplateByTopic(hotelId: string, topicId: string) {
    return this.get(`/api/v1/entity/${hotelId}/templates/topic/${topicId}`);
  }

  /**
   * @function getAllSubscriberGroup function to get subscribers group.
   * @param hotelId dynamically getting hotel id.
   * @returns get api of getting subscribers group.
   */
  getAllSubscriberGroup(hotelId: string) {
    return this.get(`/api/v1/marketing/entity/${hotelId}/subscription-group`);
  }

  /**
   * @function sendEmail function to send email.
   * @param hotelId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api to send email.
   */
  sendEmail(hotelId: string, data) {
    return this.post(`/api/v1/cms/${hotelId}/campaign`, {
      ...data,
      isDraft: false,
    });
  }

  /**
   * @function sendTest function to send test email.
   * @param hotelId dynamically getting hotel id.
   * @param data getting form input data.
   * @returns post api of sending test email.
   */
  sendTest(hotelId: string, data) {
    return this.post(`/api/v1/cms/${hotelId}/campaign/test`, data);
  }

  scheduleCampaign(hotelId: string, data) {
    return this.post(`/api/v1/cms/${hotelId}/campaign`, data);
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
    console.log({
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
    });
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
   * @param values values object to bind values with individual form fileds.
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
