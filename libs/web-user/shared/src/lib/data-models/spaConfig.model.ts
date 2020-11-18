import { FieldSchema } from './fieldSchema.model';
import * as moment from 'moment';
import { get, set } from 'lodash';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

export interface Deserializable {
  deserialize(input: any): this;
}

export class SpaDetailDS implements Deserializable {
  spaDetail: SpaDetail;

  deserialize(input: any) {
    this.spaDetail = new SpaDetail().deserialize(input);
    return this;
  }
}

export class SpaDetail {
  quantity: string;
  startTime: number;
  endTime: number;
  spaDate:string

  deserialize(input: any) {
    let startTimeFormatted;
    let spaDate;
    if(input){
      const startTime = new DateService().convertTimestampToDate(get(input,['startTime'])*1000,'DD-MM-YYYY hh:mm a');
      startTimeFormatted = moment(startTime.split(' ')[1]+startTime.split(' ')[2], 'h:mm a').format('h:mm a')||'12:00 pm'
      spaDate = new Date(get(input, ['startTime'])*1000).toISOString();
    }
      Object.assign(
        this,
        set({},'quantity',get(input, ['airportName'])||1),
        set({},'spaDate', spaDate),
        set({},'startTime', startTimeFormatted),
        set({},'endTime', get(input, ['endTime'])),
      );
    
    return this;
  }
}

export interface SpaConfigI {
    quantity: FieldSchema;
    startTime: FieldSchema;
    spaDate: FieldSchema;
    removeButton: FieldSchema;
  }