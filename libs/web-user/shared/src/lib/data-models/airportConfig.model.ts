import { FieldSchema } from './fieldSchema.model';
import * as moment from 'moment';
import { get, set } from 'lodash';
import { DateService } from '@hospitality-bot/shared/utils';

export interface Deserializable {
  deserialize(input: any): this;
}

export class AirportDetailDS implements Deserializable {
  airportDetail: AirportAmenity;

  deserialize(input: any) {
    this.airportDetail = new AirportAmenity().deserialize(input);
    return this;
  }
}

export class AirportAmenity {
  airportName: string;
  flightNumber: string;
  pickupTime: string;
  pickupDate: string;
  quantity: number;
  terminal: string;

  deserialize(input: any) {
    let pickTimeFormatted;
    let pickupDate;

    if (input) {
      let pickTime = DateService.getDateFromTimeStamp(
        get(input, ['pickupTime']) * 1000,
        'DD-MM-YYYY hh:mm a'
      );
      pickTimeFormatted =
        moment(
          pickTime.split(' ')[1] + pickTime.split(' ')[2],
          'h:mm a'
        ).format('h:mm a') || '12:00 pm';
      pickupDate = new Date(get(input, ['pickupTime']) * 1000).toISOString();
    }
    Object.assign(
      this,
      set({}, 'airportName', get(input, ['airportName'])),
      set({}, 'flightNumber', get(input, ['flightNumber'])),
      set({}, 'quantity', get(input, ['quantity']) || 1),
      set({}, 'terminal', get(input, ['terminal'])),
      set({}, 'pickupDate', pickupDate),
      set({}, 'pickupTime', pickTimeFormatted)
    );

    return this;
  }
}

export interface AirportConfigI {
  airportName: FieldSchema;
  terminal: FieldSchema;
  flightNumber: FieldSchema;
  pickupTime: FieldSchema;
  quantity: FieldSchema;
  pickupDate: FieldSchema;
}
