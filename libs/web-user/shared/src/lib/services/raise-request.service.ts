import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  RaiseRequestConfigI,
  RaiseRequestDetailDetailDS,
} from '../data-models/raiseRequestConfig.model';
import { ReservationService } from './booking.service';

@Injectable()
export class RaiseRequestService extends ReservationService {
  private _raiseRequestDetailDS: RaiseRequestDetailDetailDS;
  raiseRequestDetailDS$ = new Subject();

  initGuestDetailDS({ guestDetails }) {
    this._raiseRequestDetailDS = new RaiseRequestDetailDetailDS().deserialize(
      guestDetails
    );
  }

  setFieldConfigForRaiseRequest() {
    let raiseRequestFieldSchema = {};

    raiseRequestFieldSchema['message'] = new FieldSchema().deserialize({
      label: '',
      appearance: 'outline',
      type: 'textarea',
      placeholder:
        'Request us for COVID-19 Policies, Required Documents, Hotel Sanitation Measures etc.',
    });

    raiseRequestFieldSchema['emailId'] = new FieldSchema().deserialize({
      label: '',
      appearance: 'outline',
      placeholder: 'Enter Your Email',
    });

    return raiseRequestFieldSchema as RaiseRequestConfigI;
  }

  saveRaiseRequest(hotelId, data): Observable<RaiseRequestConfigI> {
    return this.apiService.post(`/api/v1/hotel/${hotelId}/raise-concern`, data);
  }

  updateRaiseRequestDetailDS(value) {
    this._raiseRequestDetailDS.deserialize(value);
    this.raiseRequestDetailDS$.next(this._raiseRequestDetailDS);
  }

  get guestDetails() {
    return this._raiseRequestDetailDS;
  }
}
