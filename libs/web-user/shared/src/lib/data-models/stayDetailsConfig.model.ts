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
  expectedTime:string;
  deserialize(input: any) {
    //input.expectedArrivalTime = 1604201400;
    let expectedTime = new DateService().convertTimestampToDate(get(input,['expectedArrivalTime'])*1000,'DD-MM-YYYY hh:mm a');
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
      set({}, 'adultsCount', get(input, ['adultsCount'])),
      set({}, 'expectedTime', moment(expectedTime.split(' ')[1]+expectedTime.split(' ')[2], 'h:mm a').format('h:mm a')||'7:00 am'),
      
    );
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
  expectedTime: FieldSchema;
  travellingWithLabel: FieldSchema;
}

export interface SpecialCommentsConfigI {
  comments: FieldSchema;
}

// set({},'',get(input,[''])),
