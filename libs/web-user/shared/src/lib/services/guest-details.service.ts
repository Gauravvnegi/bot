import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  ContactDetails,
  Guest,
  GuestDetails,
  ReservationDetails,
} from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { Observable, Subject } from 'rxjs';
import { CountryCodes } from '../../../../shared/src/lib/data-models/countryCode';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  GuestDetailDS,
  GuestDetailsConfigI,
} from '../data-models/guestDetailsConfig.model';
import { ReservationService } from './booking.service';

@Injectable()
export class GuestDetailsService extends ReservationService {
  private _guestDetailDS: GuestDetailDS;
  guestDetailDS$ = new Subject();
  guestDetailForm;

  initGuestDetailDS({ guestDetails }) {
    this._guestDetailDS = new GuestDetailDS().deserialize(guestDetails);
  }

  setFieldConfigForGuestDetails() {
    let guestDetailsFieldSchema = {};

    guestDetailsFieldSchema['salutation'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      options: [
        { key: 'Mr.', value: 'Mr.' },
        { key: 'Ms.', value: 'Ms.' },
      ],
    });
    guestDetailsFieldSchema['firstName'] = new FieldSchema().deserialize({
      label: 'First Name',
      disable: false,
      icon: 'person',
    });
    guestDetailsFieldSchema['lastName'] = new FieldSchema().deserialize({
      label: 'Last Name',
      disable: false,
      icon: 'person',
    });
    guestDetailsFieldSchema['email'] = new FieldSchema().deserialize({
      label: 'Email ID',
      disable: false,
      icon: 'email',
    });
    guestDetailsFieldSchema['phone'] = new FieldSchema().deserialize({
      label: 'Phone No.',
      icon: 'call',
    });
    guestDetailsFieldSchema['country'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      options: CountryCodes,
    });

    return guestDetailsFieldSchema as GuestDetailsConfigI;
  }

  modifyGuestDetails(value) {
    let data = new GuestDetails();
    data.primaryGuest = new Guest();
    data.secondaryGuest = new Array<Guest>();

    data.primaryGuest = this.mapGuestDetailValues(
      data.primaryGuest,
      value.guestDetail.primaryGuest
    );

    if (
      value.guestDetail.secondaryGuest &&
      value.guestDetail.secondaryGuest.length
    ) {
      for (let i = 0; i < value.guestDetail.secondaryGuest.length; i++) {
        data.secondaryGuest[i] = new Guest();
        data.secondaryGuest[i] = this.mapGuestDetailValues(
          data.secondaryGuest[i],
          value.guestDetail.secondaryGuest[i]
        );
      }
    }
    return data;
  }

  validateGuestDetailForm(guestDetailForm: FormGroup) {
    let status = [];
    this.guestDetailForm = guestDetailForm;

    if (guestDetailForm.invalid) {
      const primaryGuest = this.primaryGuest;
      status = this.validate(primaryGuest, status);
      const secondaryGuest = this.secondaryGuest;
      secondaryGuest &&
        secondaryGuest.controls.forEach((guest, index) => {
          status = this.validate(guest, status, index);
        });
    }
    return status;
  }

  validate(form, status, index?) {
    let id = form.get('id').value;
    Object.keys(form.controls).forEach((key) => {
      let control = form.get(key);
      let msg;
      if (control.invalid) {
        if (control.value === '') {
          msg = `Please enter the ${key}`;
        } else {
          msg = `Please enter the valid ${key}`;
        }
        status.push({
          validity: false,
          msg: msg,
          data: {
            guestId: id,
            index,
          },
        });
      }
    });
    return status;
  }

  updateGuestDetails(reservationId, data): Observable<ReservationDetails> {
    return this.apiService.put(
      `/api/v1/reservation/${reservationId}/guests`,
      data
    );
  }

  mapGuestDetailValues(data, value) {
    data.id = value.id;
    data.firstName = value.firstName;
    data.lastName = value.lastName;
    data.nameTitle = value.nameTitle;
    data.contactDetails = new ContactDetails();
    data.contactDetails.cc = value.nationality;
    data.contactDetails.emailId = value.email;
    data.contactDetails.contactNumber = value.mobileNumber;
    return data;
  }

  updateGuestDetailDS(value) {
    this._guestDetailDS.deserialize(value);
    this.guestDetailDS$.next(this._guestDetailDS);
  }

  get primaryGuest() {
    return this.guestDetailForm.controls.guestDetail.get(
      'primaryGuest'
    ) as FormGroup;
  }

  get secondaryGuest() {
    return this.guestDetailForm.controls.guestDetail.get(
      'secondaryGuest'
    ) as FormArray;
  }

  get guestDetails() {
    return this._guestDetailDS;
  }
}
