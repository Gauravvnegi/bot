import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import {
  ContactDetails,
  Guest,
  GuestDetails,
  ReservationDetails,
} from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { Observable, Subject } from 'rxjs';
import {
  CountryCodes,
  Country,
} from '../../../../shared/src/lib/data-models/countryCode';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  GuestDetailDS,
  GuestDetailsConfigI,
} from '../data-models/guestDetailsConfig.model';

@Injectable()
export class GuestDetailsService extends ApiService {
  private _guestDetailDS: GuestDetailDS;
  guestDetailDS$ = new Subject();
  guestDetailForm;

  initGuestDetailDS({ guestDetails }) {
    this._guestDetailDS = new GuestDetailDS().deserialize(guestDetails);
  }

  setFieldConfigForGuestDetails(config) {
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
      isOptionsOpenedChanged: true,
      optionsOpened: new Country().getCountryListWithDialCode([
        config.hotelNationality,
      ]),
      optionsClosed: new Country().getDialCodeList([config.hotelNationality]),
    });

    return guestDetailsFieldSchema as GuestDetailsConfigI;
  }

  modifyGuestDetails(value) {
    let data = {};
    data['primaryGuest'] = new Guest();
    // data.secondaryGuest = new Array<Guest>();
    data['accompanyGuests'] = new Array<Guest>();
    data['sharerGuests'] = new Array<Guest>();
    data['kids'] = new Array<Guest>();

    if (value.guestDetail.guests && value.guestDetail.guests.length) {
      for (let i = 0; i < value.guestDetail.guests.length; i++) {
        if (value.guestDetail.guests[i].type === 'primary') {
          data['primaryGuest'] = this.mapGuestDetailValues(
            data['primaryGuest'],
            value.guestDetail.guests[i]
          );
        } else if (value.guestDetail.guests[i].role === 'accompany') {
          data['accompanyGuests'][i] = new Guest();
          data['accompanyGuests'][i] = this.mapGuestDetailValues(
            data['accompanyGuests'][i],
            value.guestDetail.guests[i]
          );
        } else if (value.guestDetail.guests[i].role === 'kids') {
          data['kids'][i] = new Guest();
          data['kids'][i] = this.mapGuestDetailValues(
            data['kids'][i],
            value.guestDetail.guests[i]
          );
        } else if (value.guestDetail.guests[i].role === 'sharer') {
          data['sharerGuests'][i] = new Guest();
          data['sharerGuests'][i] = this.mapGuestDetailValues(
            data['sharerGuests'][i],
            value.guestDetail.guests[i]
          );
        }
      }
    }
    return data;
  }

  validateGuestDetailForm(guestDetailForm: FormGroup) {
    let guestDetailFG = guestDetailForm.get('guestDetail') as FormGroup;
    let status = [];
    if (guestDetailFG.invalid) {
      if (guestDetailFG.get('guests').invalid) {
        const guestFA = guestDetailFG.get('guests') as FormArray;

        guestFA.controls.forEach((control: FormGroup, index) => {
          if (control.invalid) {
            status.push({
              validity: false,
              code: 'INVALID_FORM',
              msg: 'Invalid form. Please fill all the fields.',
              data: {
                guestId: control.get('id').value,
                index,
                type: control.get('type').value,
              },
            });
          }
        });
      }
    }
    return status;
  }

  updateGuestDetails(reservationId, data): Observable<ReservationDetails> {
    return this.put(`/api/v1/reservation/${reservationId}/guests`, data);
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

  get guestDetails() {
    return this._guestDetailDS;
  }
}
