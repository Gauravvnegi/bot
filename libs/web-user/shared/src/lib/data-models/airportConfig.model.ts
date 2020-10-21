import { FieldSchema } from './fieldSchema.model';
import * as moment from 'moment';
import { get, set } from 'lodash';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

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
  pickupTime: number;
  pickupDate: string;
  quantity: string;
  terminal: string;

  deserialize(input: any) {
    if(input){
      let pickTime = new DateService().convertTimestampToDate(get(input,['pickupTime'])*1000,'DD-MM-YYYY hh:mm a');
      Object.assign(
        this,
        set({},'airportName',get(input, ['airportName'])),
        set({},'flightNumber', get(input, ['flightNumber'])),
        set({}, 'quantity', get(input, ['quantity'])),
        set({}, 'terminal', get(input, ['terminal'])),
        set({}, 'pickupDate', new Date(get(input, ['pickupTime'])*1000).toISOString()),
        set({}, 'pickupTime', moment(pickTime.split(' ')[1]+pickTime.split(' ')[2], 'h:mm a').format('h:mm a')||'7:00 am'),
      );
    }
    
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
  removeButton: FieldSchema;
}
  