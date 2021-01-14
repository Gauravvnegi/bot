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
      map(() => {
        return {
          departmentRatingQuestion: {
            positive_title: 'Which department you liked most? ',
            negative_title: 'Which department we can improve upon?',
          },
          created_time: 1597119345584,
          ratingScale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          hotel_id: '5ef958ce-39a7-421c-80e8-ee9973e27b99',
          ratingScaleConfig: {
            '[1]': { category: 'very Poor', color: '#ee5955' },
            '[2]': { category: 'Poor', color: '#ee5955' },
            '[3,4,5]': { category: 'Adequate', color: '#ee5955' },
            '[6,7]': { category: 'Good', color: '#7ab243' },
            '[8,9]': { category: 'Very Good', color: '#7ab243' },
            '[10]': { category: 'OutStanding', color: '#7ab243' },
          },
          hotelRatingQuestion: {
            positive_title: 'What did you liked most? ',
            negative_title: 'Where we can improve on',
          },
          suggestions: [
            {
              id: 1,
              label: 'Facilities',
              url:
                'https://craterzone-backup.nyc3.cdn.digitaloceanspaces.com/feedback/facilities.svg',
            },
            {
              id: 2,
              label: 'Staff Assistance',
              url:
                'https://craterzone-backup.nyc3.cdn.digitaloceanspaces.com/feedback/staff-assistance.svg',
            },
            {
              id: 3,
              label: 'Food',
              url:
                'https://craterzone-backup.nyc3.cdn.digitaloceanspaces.com/feedback/food.svg',
            },
            {
              id: 4,
              label: 'Cleanliness',
              url:
                'https://craterzone-backup.nyc3.cdn.digitaloceanspaces.com/feedback/cleanliness.svg',
            },
          ],
          _id: '54df4cd0-4912-47cd-b79e-1cb9e7299b92',
          serviceRatingQuestion: {
            positive_title: 'Which service you liked most? ',
            negative_title: 'Which service we can improve upon?',
          },
          departments: [
            {
              id: 1,
              label: 'Reservations',
              services: [
                {
                  id: 2,
                  label: 'Upgrade Base to 1BHK',
                  touchpoints: [
                    { id: 3, label: 'Politeness of staff' },
                    { id: 4, label: 'efficiency of staff' },
                  ],
                },
                {
                  id: 5,
                  label: 'Upgrade Base to Panoramic suite',
                  touchpoints: [
                    { id: 6, label: 'Politeness of staff' },
                    { id: 7, label: 'efficiency of staff' },
                  ],
                },
              ],
            },
            {
              id: 8,
              label: 'Front Office',
              services: [
                {
                  id: 9,
                  label: 'CockTail Hours',
                  touchpoints: [
                    { id: 10, label: 'Politeness of staff' },
                    { id: 11, label: 'efficiency of staff' },
                  ],
                },
                {
                  id: 12,
                  label: 'Valet Service',
                  touchpoints: [
                    { id: 13, label: 'Handling of car' },
                    { id: 14, label: 'Politeness of staff' },
                    { id: 15, label: 'efficiency of staff' },
                  ],
                },
                {
                  id: 16,
                  label: 'Luggage Service',
                  touchpoints: [
                    { id: 17, label: 'Cab for local run 4hr/40km' },
                    { id: 18, label: 'efficiency of staff' },
                  ],
                },
              ],
            },
            {
              id: 19,
              label: 'House Keeping',
              services: [
                {
                  id: 20,
                  label: 'Essentials',
                  touchpoints: [
                    { id: 21, label: 'Pillow' },
                    { id: 22, label: 'Blanket' },
                    { id: 23, label: 'Rooms' },
                  ],
                },
                {
                  id: 24,
                  label: 'Complaints',
                  touchpoints: [
                    { id: 25, label: 'Wifi not working' },
                    { id: 26, label: 'Pest control' },
                    { id: 27, label: 'Shower cap' },
                  ],
                },
              ],
            },
            {
              id: 28,
              label: 'Maintenance',
              services: [
                {
                  id: 29,
                  label: 'Enginnering',
                  touchpoints: [
                    { id: 30, label: 'Electicity' },
                    { id: 31, label: 'Temperature' },
                    { id: 32, label: 'Ambience' },
                  ],
                },
              ],
            },
            {
              id: 33,
              label: 'Foods \u0026 beverages',
              services: [
                {
                  id: 34,
                  label: 'Table reservations',
                  touchpoints: [
                    { id: 35, label: 'food quality and taste' },
                    { id: 36, label: 'Politeness of staff' },
                    { id: 37, label: 'efficiency of staff' },
                  ],
                },
              ],
            },
          ],
        };
      }),
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
