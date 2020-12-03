import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

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
  remarks: string;

  deserialize(input: any) {
    
      Object.assign(
        this,
        set({},'quantity',get(input, ['quantity'])|| 1),
        set({},'remarks', get(input, ['remarks'])),
      );
    
    return this;
  }
}

export interface DefaultAmenityConfigI {
    quantity: FieldSchema;
    remark: FieldSchema
  }