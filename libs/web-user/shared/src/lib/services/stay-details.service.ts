import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable, Subject } from 'rxjs';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { ReservationDetails } from '../data-models/reservationDetails';
import {
  AddressConfigI,
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

  initStayDetailDS({ stayDetails }, timezone) {
    this._stayDetailDS = new StayDetailDS().deserialize(stayDetails, timezone);
  }

  setFieldConfigForStayDetails() {
    let stayDetailsFieldSchema = {};

    stayDetailsFieldSchema['startDate'] = new FieldSchema().deserialize({
      label: 'Arrival Date',
      disable: true,
      isDatePickerDisable: true,
      required: true,
    });
    stayDetailsFieldSchema['endDate'] = new FieldSchema().deserialize({
      label: 'Departure Date',
      disable: true,
      isDatePickerDisable: true,
      required: true,
    });
    stayDetailsFieldSchema[
      'expectedArrivalTime'
    ] = new FieldSchema().deserialize({
      label:
        'Early check-in is subject to availability, please mention in special request if required.',
      disable: false,
      format: 24,
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

    stayDetailsFieldSchema[
      'expectedArrivalTimeLabel'
    ] = new FieldSchema().deserialize({
      master_label: 'Expected Arrival Time',
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '16px',
        },
      },
    });

    stayDetailsFieldSchema[
      'expectedDepartureTimeLabel'
    ] = new FieldSchema().deserialize({
      master_label: 'Expected Departure Time',
      style: {
        childLabelStyles: {
          'font-weight': 700,
          color: '#888888',
          'font-size': '16px',
        },
      },
    });

    stayDetailsFieldSchema[
      'expectedDepartureTime'
    ] = new FieldSchema().deserialize({
      label:
        'Late checkout is subject to availability, please mention in special request if required.',
      disable: false,
      format: 24,
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
      required: true,
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
      required: true,
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
        'In case of any special requests like dinner reservations, Spa Relaxation Appointments, Rooms Appointment preferences and Transportation Requests. You may add your GST number as well',
    });

    return specialCommentsFieldSchema as SpecialCommentsConfigI;
  }

  setFieldForAddress() {
    let addressFieldSchema = {};

    addressFieldSchema['address'] = new FieldSchema().deserialize({
      label: 'address',
      appearance: 'outline',
      type: 'textarea',
      placeholder: 'Please enter address',
    });

    return addressFieldSchema as AddressConfigI;
  }

  updateStayDetails(reservationId, data): Observable<ReservationDetails> {
    return this.patch(`/api/v1/reservation/${reservationId}`, data);
  }

  modifyStayDetails(stayDetails) {
    return {
      stayDetails: {
        address: stayDetails.address.address,
        comments: stayDetails.special_comments.comments,
        expectedArrivalTime: this.getArrivalTimeTimestamp(stayDetails),
        expectedDepartureTime: this.getDepartureTimeTimestamp(stayDetails),
      },
    };
  }

  getArrivalTimeTimestamp(stayDetails) {
    let arrivalDate = stayDetails.stayDetail.arrivalTime.split('T')[0];
    let time = moment(
      stayDetails.stayDetail.expectedArrivalTime,
      'hh:mm A'
    ).format('HH:mm');
    return DateService.convertDateToTimestamp(arrivalDate + 'T' + time);
  }

  getDepartureTimeTimestamp(stayDetails) {
    let departureDate = stayDetails.stayDetail.departureTime.split('T')[0];
    let time = moment(
      stayDetails.stayDetail.expectedDepartureTime,
      'hh:mm A'
    ).format('HH:mm');
    return DateService.convertDateToTimestamp(departureDate + 'T' + time);
  }

  updateStayDetailDS(value, timezone) {
    this._stayDetailDS.deserialize(value, timezone);
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

  get address() {
    return this._stayDetailDS && this._stayDetailDS.address;
  }
}
