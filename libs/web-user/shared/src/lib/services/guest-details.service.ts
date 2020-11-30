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
    let guestDetailFG = guestDetailForm.get('guestDetail') as FormGroup;
    let status = [];
    if (guestDetailFG.invalid) {
      if (guestDetailFG.get('primaryGuest').invalid) {
        status.push({
          validity: false,
          code: 'INVALID_FORM',
          msg: 'Invalid form. Please fill all the fields.',
          data: {
            guestId: guestDetailFG.get('primaryGuest').get('id').value,
            type: 'primary',
            index: 0,
          },
        });
      } else if (guestDetailFG.get('secondaryGuest').invalid) {
        const secondaryGuestFA = guestDetailFG.get(
          'secondaryGuest'
        ) as FormArray;

        secondaryGuestFA.controls.forEach((control: FormGroup, index) => {
          if (control.invalid) {
            status.push({
              validity: false,
              code: 'INVALID_FORM',
              msg: 'Invalid form. Please fill all the fields.',
              data: {
                guestId: control.get('id').value,
                index,
                type: 'secondary',
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
