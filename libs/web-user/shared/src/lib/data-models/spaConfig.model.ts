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
  usageTime: number;
  spaDate:string

  deserialize(input: any) {
    if(input){
      let usageTime = new DateService().convertTimestampToDate(get(input,['usageTime'])*1000,'DD-MM-YYYY hh:mm a');
      Object.assign(
        this,
        set({},'quantity',get(input, ['airportName'])),
        set({},'spaDate', new Date(get(input, ['usageTime'])*1000).toISOString()),
        set({},'usageTime', moment(usageTime.split(' ')[1]+usageTime.split(' ')[2], 'h:mm a').format('h:mm a')||'7:00 am'),
      );
    }
    return this;
  }
}

export interface SpaConfigI {
    quantity: FieldSchema;
    usageTime: FieldSchema;
    spaDate: FieldSchema;
    removeButton: FieldSchema;
  }