import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable, Subject } from 'rxjs';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ReservationDetails } from '../data-models/reservationDetails';
import {
  SpecialCommentsConfigI,
  StayDetailDS,
  StayDetailsConfigI,
} from '../data-models/stayDetailsConfig.model';
import * as moment from 'moment';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Injectable()
export class StayDetailsService extends ApiService {
  private _stayDetailDS: StayDetailDS;
  stayDetailDS$ = new Subject();

  initStayDetailDS({ stayDetails }) {
    this._stayDetailDS = new StayDetailDS().deserialize(stayDetails);
  }

  setFieldConfigForStayDetails() {
    let stayDetailsFieldSchema = {};

    stayDetailsFieldSchema['startDate'] = new FieldSchema().deserialize({
      label: 'Arrival Date',
      disable: true,
      isDatePickerDisable: true,
    });
    stayDetailsFieldSchema['endDate'] = new FieldSchema().deserialize({
      label: 'Departure Date',
      disable: true,
      isDatePickerDisable: true,
    });
    stayDetailsFieldSchema['expectedTime'] = new FieldSchema().deserialize({
      label: 'Expected Arrival Time',
      disable: false,
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '13px',
        },
      },
    });

    stayDetailsFieldSchema[
      'travellingWithLabel'
    ] = new FieldSchema().deserialize({
      master_label: 'Travelling with',
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '13px',
        },
      },
    });

    stayDetailsFieldSchema['adultGuest'] = new FieldSchema().deserialize({
      label: '',
      disable: true,
      master_label: 'Adults',
    });
    stayDetailsFieldSchema['kidsGuest'] = new FieldSchema().deserialize({
      label: '',
      disable: true,
      master_label: 'Kids',
    });
    stayDetailsFieldSchema['roomType'] = new FieldSchema().deserialize({
      label: 'Room Type',
      disable: true,
      // options: [
      //   { key: 'DELUXE', value: 'DELUXE' },
      //   { key: 'LUXURY', value: 'LUXURY' },
      //   { key: 'BASE', value: 'BASE' },
      // ],
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    return stayDetailsFieldSchema as StayDetailsConfigI;
  }

  setFieldConfigForSpecialComments() {
    let specialCommentsFieldSchema = {};

    specialCommentsFieldSchema['comments'] = new FieldSchema().deserialize({
      label: 'comments',
      appearance: 'outline',
      type: 'textarea',
      placeholder:
        'Request us for anything. Like Airport Drop Off, Pickup at Airport, New Guest Towels,Go for Sightseeing.',
    });

    return specialCommentsFieldSchema as SpecialCommentsConfigI;
  }

  updateStayDetails(reservationId, data): Observable<ReservationDetails> {
    return this.patch(`/api/v1/reservation/${reservationId}`, data);
  }

  modifyStayDetails(stayDetails) {
    let arrivalTime = this.getArrivalTimeTimestamp(stayDetails);
    return {
      stayDetails: {
        comments: stayDetails.special_comments.comments,
        expectedArrivalTime: arrivalTime,
      },
    };
  }

  getArrivalTimeTimestamp(stayDetails) {
    let arrivalDate = stayDetails.stayDetail.arrivalTime.split('T')[0];
    let time = moment(stayDetails.stayDetail.expectedTime, 'hh:mm').format(
      'hh:mm'
    );
    return new DateService().convertDateToTimestamp(arrivalDate + 'T' + time);
  }

  updateStayDetailDS(value) {
    this._stayDetailDS.deserialize(value);
    this.stayDetailDS$.next(this._stayDetailDS);
  }

  get stayDetail() {
    return this._stayDetailDS && this._stayDetailDS.stayDetail;
  }

  get special_comments() {
    return this._stayDetailDS && this._stayDetailDS.special_comments;
  }

  get stayDetails() {
    return this._stayDetailDS;
  }
}
