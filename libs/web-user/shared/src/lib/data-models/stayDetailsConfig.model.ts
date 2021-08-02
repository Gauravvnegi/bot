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

  deserialize(input: any) {
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
  deserialize(input: any) {
    let expectedArrivalTime = DateService.getDateFromTimeStamp(
      get(input, ['expectedArrivalTime']),
      'DD-MM-YYYY hh:mm a'
    );
    let expectedDepartureTime = DateService.getDateFromTimeStamp(
      get(input, ['expectedDepartureTime']),
      'DD-MM-YYYY hh:mm a'
    );
    Object.assign(
      this,
      set(
        {},
        'arrivalTime',
        new Date(get(input, ['arrivalTime'])).toISOString()
      ),
      set(
        {},
        'departureTime',
        new Date(get(input, ['departureTime'])).toISOString()
      ),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount']))
    );
    this.expectedArrivalTime =
      input.expectedArrivalTime === 0
        ? '02:00 pm'
        : moment(
            expectedArrivalTime.split(' ')[1] +
              expectedArrivalTime.split(' ')[2],
            'h:mm a'
          ).format('h:mm a');
    this.expectedDepartureTime =
      input.expectedDepartureTime === 0
        ? '12:00 pm'
        : moment(
            expectedDepartureTime.split(' ')[1] +
              expectedDepartureTime.split(' ')[2],
            'h:mm a'
          ).format('h:mm a');
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

// set({},'',get(input,[''])),
