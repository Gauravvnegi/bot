import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import * as moment from 'moment';

export interface Deserializable {
  deserialize(input: any): this;
}

export class StayDetailDS implements Deserializable {
  stayDetail: StayDetail;
  special_comments: SpecialComments;

  deserialize(input: any, timezone = '+05:30') {
    this.stayDetail = new StayDetail().deserialize(input);
    this.special_comments = new SpecialComments().deserialize(input);
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
        moment(get(input, ['arrivalTime']))
          .utcOffset(timezone)
          .toISOString()
      ),
      set(
        {},
        'departureTime',
        moment(get(input, ['departureTime']))
          .utcOffset(timezone)
          .toISOString()
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
