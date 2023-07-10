import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  RaiseRequestConfigI,
  RaiseRequestDetailDetailDS,
} from '../data-models/raiseRequestConfig.model';
import { Subject } from 'rxjs';

@Injectable()
export class RaiseRequestService extends ApiService {
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
      required: true,
    });

    raiseRequestFieldSchema['emailId'] = new FieldSchema().deserialize({
      label: '',
      appearance: 'outline',
      placeholder: 'Enter Your Email',
      floatLabel: 'always',
      required: true,
    });

    return raiseRequestFieldSchema as RaiseRequestConfigI;
  }

  saveRaiseRequest(entityId, data): Observable<RaiseRequestConfigI> {
    return this.post(`/api/v1/entity/${entityId}/raise-concern`, data);
  }

  updateRaiseRequestDetailDS(value) {
    this._raiseRequestDetailDS.deserialize(value);
    this.raiseRequestDetailDS$.next(this._raiseRequestDetailDS);
  }

  get guestDetails() {
    return this._raiseRequestDetailDS;
  }
}
