import { FieldSchema } from './fieldSchema.model';
import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class RaiseRequestDetailDetailDS implements Deserializable {
  primaryGuest: RaiseRequestDetail;

  deserialize(input: any) {
    this.primaryGuest = new RaiseRequestDetail().deserialize(input);
    return this;
  }
}

export class RaiseRequestDetail implements Deserializable {
  message: string;
  emailId: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'message', get(input, ['message'])),
      set({}, 'emailId', get(input, ['emailId'])),
    );
    return this;
  }
}

export interface RaiseRequestConfigI {
    message : FieldSchema;
    emailId : FieldSchema;
  }