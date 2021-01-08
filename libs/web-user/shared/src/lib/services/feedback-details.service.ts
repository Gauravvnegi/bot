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
import { IFeedbackConfigResObj } from 'libs/web-user/templates/temp000001/src/lib/types/feedback';
import { map } from 'rxjs/operators';
import {
  HotelRatingConfig,
  Hotel,
} from 'libs/web-user/templates/temp000001/src/lib/models/feedback';

@Injectable()
export class FeedbackDetailsService extends ApiService {
  public _selectedServices;

  setFieldConfigForFeedbackDetails({
    hotelRatingQuestion,
    departmentRatingQuestion,
    serviceRatingQuestion,
  }) {
    let feedbackDetailsFieldSchema = {};

    feedbackDetailsFieldSchema['hotelFeedback'] = new FieldSchema().deserialize(
      {
        label: '',
        disable: false,
        appearance: 'outline',
        placeholder: hotelRatingQuestion,
      }
    );

    feedbackDetailsFieldSchema[
      'departmentFeedback'
    ] = new FieldSchema().deserialize({
      label: '',
      disable: false,
      appearance: 'outline',
      placeholder: departmentRatingQuestion,
    });

    feedbackDetailsFieldSchema[
      'serviceFeedback'
    ] = new FieldSchema().deserialize({
      label: '',
      disable: false,
      appearance: 'outline',
      placeholder: serviceRatingQuestion,
    });

    return feedbackDetailsFieldSchema;
  }

  getHotelFeedbackConfig({
    hotelId,
  }: {
    hotelId: string;
  }): Observable<IFeedbackConfigResObj> {
    return this.get(`/api/v1/cms/hotel/${hotelId}/feedback-form`).pipe(
      map((res) => {
        return {
          ...new HotelRatingConfig().deserialize(res),
          ...new Hotel().deserialize(res),
        };
      })
    );
  }

  addFeedback(reservationId, data) {
    return this.post(`/api/v1/reservation/${reservationId}/feedback`, data);
  }

  mapFeedbackData(feedbackValues, guestId) {
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
        code: 'SELECT_RATING_PENDING',
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
}
