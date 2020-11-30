import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import {
  FeedbackConfigDS,
  FeedbackConfigI,
  FeedbackData,
  FeedbackDetailsConfigI,
  Service,
} from '../data-models/feedbackDetailsConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';

@Injectable()
export class FeedbackDetailsService extends ApiService {
  private _feedBackConfigDS: FeedbackConfigDS;
  public _selectedServices;

  initFeedbackConfigDS(feedbackConfig) {
    this._feedBackConfigDS = new FeedbackConfigDS().deserialize(feedbackConfig);
  }

  setFieldConfigForFeedbackDetails(feedbackText) {
    let feedbackDetailsFieldSchema = {};

    feedbackDetailsFieldSchema[
      'feedbackComents'
    ] = new FieldSchema().deserialize({
      label: '',
      disable: false,
      appearance: 'outline',
      placeholder: feedbackText,
    });

    return feedbackDetailsFieldSchema as FeedbackDetailsConfigI;
  }

  getFeedback(): Observable<FeedbackConfigI> {
    return this.get(`/api/v1/cms/feedback-form`);
  }

  addFeedback(reservationId, data) {
    return this.post(`/api/v1/reservation/${reservationId}/feedback`, data);
  }

  mapFeedbackData(feedbackValues,guestId) {
    const selectedServices = this.selectedServices;
    let feedbackData = new FeedbackData();
    feedbackData.services = new Array<Service>();
    feedbackData.guestId = guestId;
    feedbackData.services = selectedServices;
    feedbackData.comments = feedbackValues.feedback;
    feedbackData.rating = feedbackValues.rating;
    return feedbackData;
  }

  validateFeedbackDetailForm(feedbackDetailForm: FormGroup) {
    let status = [];

    if (feedbackDetailForm.invalid) {
      status.push({
        validity: false,
        code: "SELECT_RATING_PENDING",
        data: {},
      });
    }
    return status;
  }

  set selectedServices(services) {
    this._selectedServices = services;
  }

  get selectedServices() {
    return this._selectedServices;
  }

  get feedbackConfigDS() {
    return this._feedBackConfigDS;
  }
}
