import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';
import { DateService } from '@hospitality-bot/shared/utils';

export interface Deserializable {
  deserialize(input: any): this;
}

export class DefaultDetailDS implements Deserializable {
  defaultDetail: defaultAmenity;

  deserialize(input: any) {
    this.defaultDetail = new defaultAmenity().deserialize(input);
    return this;
  }
}

export class defaultAmenity {
  quantity: number;
  pickupTime: string;
  pickupDate: string;
  remarks: string;

  deserialize(input: any) {
    let pickTimeFormatted;
    let pickupDate;

    if (input) {
      let pickTime = DateService.getDateFromTimeStamp(
        get(input, ['pickupTime']) * 1000,
        'hh:mm a'
      );
      pickTimeFormatted = pickTime || '12:00 pm';
      pickupDate = new Date(get(input, ['pickupTime']) * 1000).toISOString();
    }
    Object.assign(
      this,
      set({}, 'quantity', get(input, ['quantity']) || 1),
      set({}, 'remarks', get(input, ['remarks'])),
      set({}, 'pickupDate', pickupDate),
      set({}, 'pickupTime', pickTimeFormatted)
    );

    return this;
  }
}

export interface DefaultAmenityConfigI {
  quantity: FieldSchema;
  pickupDate: FieldSchema;
  pickupTime: FieldSchema;
  remark: FieldSchema;
}
