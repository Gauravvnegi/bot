import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class BreakfastDetailDS implements Deserializable {
  breakfastDetail: BreakfastDetails;

  deserialize(input: any) {
    this.breakfastDetail = new BreakfastDetails().deserialize(input);
    return this;
  }
}

export class BreakfastDetails {
  quantity: string;

  deserialize(input: any) {
      Object.assign(
        this,
        set({}, 'quantity', get(input, ['quantity'])||1),
      );
    return this;
  }
}

export interface BreakfastConfigI {
  quantity: FieldSchema;
  removeButton: FieldSchema;
}