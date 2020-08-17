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
    });
    stayDetailsFieldSchema['endDate'] = new FieldSchema().deserialize({
      label: 'Departure Date',
      disable: true,
    });

    stayDetailsFieldSchema[
      'travellingWithLabel'
    ] = new FieldSchema().deserialize({
      master_label: 'Travelling with',
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
      options: [
        { key: 'DELUXE', value: 'DELUXE' },
        { key: 'LUXURY', value: 'LUXURY' },
        { key: 'BASE', value: 'BASE' },
      ],
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

  modifyStayDetails({ special_comments }) {
    return {
      stayDetails: special_comments,
    };
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
