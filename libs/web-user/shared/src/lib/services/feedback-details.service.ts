import { Injectable } from '@angular/core';
import { ReservationService } from './booking.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { FeedbackDetailsConfigI, FeedbackConfigI, FeedbackConfigDS, FeedbackData, Service } from '../data-models/feedbackDetailsConfig.model';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FeedbackDetailsService extends ReservationService {

  private _feedBackConfigDS: FeedbackConfigDS;
  public _selectedServices;

  initFeedbackConfigDS( feedbackConfig ) {
    this._feedBackConfigDS = new FeedbackConfigDS().deserialize(feedbackConfig);
  }
  
  setFieldConfigForFeedbackDetails() {
    let feedbackDetailsFieldSchema = {};

    feedbackDetailsFieldSchema['feedbackComents'] = new FieldSchema().deserialize({
      label: '',
      disable: false,
      appearance: 'outline',
      placeholder: 'Tell us what went wrong'
    });

    return feedbackDetailsFieldSchema as FeedbackDetailsConfigI;
  }

  getFeedback(): Observable<FeedbackConfigI> {
    return this.apiService.get(`/api/v1/cms/feedback-form`);
  }

  addFeedback(reservationId, data) {
    return this.apiService.post(`/api/v1/reservation/${reservationId}/feedback`, data);
  }

  mapFeedbackData(feedbackValues){
    const selectedServices = this.selectedServices;
    let feedbackData = new FeedbackData();
    feedbackData.services = new Array<Service>();
    feedbackData.guestId = '661ab93f-01c8-46e1-a0a1-af9eb597e574';
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
        msg: 'Please select the Rating',
        data: {},
      });
    }
    return status;
  }

  set selectedServices(services) {
    this._selectedServices = services;
  }

  get selectedServices(){
    return this._selectedServices;
  }

  get feedbackConfigDS() {
    return this._feedBackConfigDS;
  }
}
