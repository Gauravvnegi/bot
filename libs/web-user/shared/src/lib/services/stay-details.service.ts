import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
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
import { DateService } from '@hospitality-bot/shared/utils';

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
      master_label: 'Room Occupancy',
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

  setFieldForAddress(countriesList) {
    let addressFieldSchema = {};

    addressFieldSchema['addressLine1'] = new FieldSchema().deserialize({
      label: 'Address Line 1',
      required: true,
      placeholder: '',
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    addressFieldSchema['addressLine2'] = new FieldSchema().deserialize({
      label: 'Address Line 2',
      placeholder: '',
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    addressFieldSchema['city'] = new FieldSchema().deserialize({
      label: 'City',
      required: true,
      placeholder: '',
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    addressFieldSchema['state'] = new FieldSchema().deserialize({
      label: 'State',
      required: true,
      placeholder: '',
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    addressFieldSchema['postalCode'] = new FieldSchema().deserialize({
      label: 'Postal Code',
      required: true,
      placeholder: '',
      style: {
        fieldParentWrapperStyles: { width: '100%' },
      },
    });

    addressFieldSchema['country'] = new FieldSchema().deserialize({
      label: 'Country',
      required: true,
      disable: false,
      options: countriesList,
    });
    return addressFieldSchema as AddressConfigI;
  }

  updateStayDetails(reservationId, data): Observable<ReservationDetails> {
    return this.patch(`/api/v1/reservation/${reservationId}`, data);
  }

  modifyStayDetails(stayDetails, timezone) {
    const data = {
      comments: stayDetails.special_comments.comments,
      expectedArrivalTime: this.getArrivalTimeTimestamp(stayDetails, timezone),
      expectedDepartureTime: this.getDepartureTimeTimestamp(
        stayDetails,
        timezone
      ),
      address: {
        addressLines: [
          stayDetails.address.addressLine1,
          stayDetails.address.addressLine2,
        ],
        city: stayDetails.address.city,
        state: stayDetails.address.state,
        countryCode: stayDetails.address.country,
        postalCode: stayDetails.address.postalCode,
      },
    };
    return {
      stayDetails: data,
    };
  }

  getArrivalTimeTimestamp(stayDetails, timezone) {
    let arrivalDate = moment(stayDetails.stayDetail.arrivalTime)
      .utcOffset(timezone)
      .format('YYYY-MM-DD');
    let time = moment(stayDetails.stayDetail.expectedArrivalTime, 'hh:mm A')
      .utcOffset(timezone)
      .format('HH:mm');
    return DateService.convertDateToTimestamp(
      arrivalDate + 'T' + time,
      timezone
    );
  }

  getDepartureTimeTimestamp(stayDetails, timezone) {
    let departureDate = moment(stayDetails.stayDetail.departureTime)
      .utcOffset(timezone)
      .format('YYYY-MM-DD');
    let time = moment(stayDetails.stayDetail.expectedDepartureTime, 'hh:mm A')
      .utcOffset(timezone)
      .format('HH:mm');
    return DateService.convertDateToTimestamp(
      departureDate + 'T' + time,
      timezone
    );
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
