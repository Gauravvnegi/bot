import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';
import { DateService } from '@hospitality-bot/shared/utils';
import * as moment from 'moment';

export interface Deserializable {
  deserialize(input: any): this;
}

export class StayDetailDS implements Deserializable {
  stayDetail: StayDetail;
  special_comments: SpecialComments;
  address: Address;

  deserialize(input: any, timezone = '+05:30') {
    this.stayDetail = new StayDetail().deserialize(input, timezone);
    this.special_comments = new SpecialComments().deserialize(input);
    this.address = new Address().deserialize(input.address);
    return this;
  }
}

export class StayDetail implements Deserializable {
  arrivalTime: string;
  departureTime: string;
  roomType: string;
  kidsCount: number;
  adultsCount: number;
  expectedArrivalTime: string;
  expectedDepartureTime: string;
  deserialize(input: any, timezone = '+05:30') {
    let expectedArrivalTime = DateService.getDateFromTimeStamp(
      get(input, ['expectedArrivalTime']),
      'DD-MM-YYYY hh:mm a',
      timezone
    );
    let expectedDepartureTime = DateService.getDateFromTimeStamp(
      get(input, ['expectedDepartureTime']),
      'DD-MM-YYYY hh:mm a',
      timezone
    );
    Object.assign(
      this,
      set(
        {},
        'arrivalTime',
        moment(get(input, ['arrivalTime'])).utcOffset(timezone)
      ),
      set(
        {},
        'departureTime',
        moment(get(input, ['departureTime'])).utcOffset(timezone)
      ),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount']))
    );
    this.expectedArrivalTime =
      input.expectedArrivalTime === 0
        ? '02:00 pm'
        : expectedArrivalTime.substr(expectedArrivalTime.indexOf(' ') + 1);
    this.expectedDepartureTime =
      input.expectedDepartureTime === 0
        ? '12:00 pm'
        : expectedDepartureTime.substr(expectedDepartureTime.indexOf(' ') + 1);
    return this;
  }
}

export class SpecialComments implements Deserializable {
  comments: string;

  deserialize(input: any) {
    Object.assign(this, set({}, 'comments', get(input, ['comments'])));
    return this;
  }
}

export class Address {
  city: string;
  state: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  postalCode: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'city', get(input, ['city'], '')),
      set({}, 'state', get(input, ['state'], '')),
      set({}, 'country', get(input, ['country'], '')),
      set({}, 'postalCode', get(input, ['postalCode'], ''))
    );
    this.addressLine1 = input.addressLines?.length ? input.addressLines[0] : '';
    this.addressLine2 =
      input.addressLines?.length > 1 ? input.addressLines[1] : '';
    return this;
  }
}

export interface StayDetailsConfigI {
  startDate: FieldSchema;
  endDate: FieldSchema;
  roomType: FieldSchema;
  adultGuest: FieldSchema;
  kidsGuest: FieldSchema;
  expectedArrivalTime: FieldSchema;
  expectedDepartureTime: FieldSchema;
  expectedArrivalTimeLabel: FieldSchema;
  expectedDepartureTimeLabel: FieldSchema;
  travellingWithLabel: FieldSchema;
}

export interface SpecialCommentsConfigI {
  comments: FieldSchema;
}

export interface AddressConfigI {
  address: FieldSchema;
}
