import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(input: any): this;
}

export class GuestDetailDS implements Deserializable {
  primaryGuest: GuestDetail;
  secondaryGuest: GuestDetail[];

  deserialize(input: any) {
    this.primaryGuest = new GuestDetail().deserialize(input.primaryGuest);
    this.secondaryGuest = new Array<GuestDetail>();
    input.secondaryGuest.forEach((guest) => {
      this.secondaryGuest.push(new GuestDetail().deserialize(guest));
    });
    return this;
  }
}

export class GuestDetail implements Deserializable {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  nationality: string;
  email: string;
  nameTitle: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'mobileNumber', get(input, ['contactDetails', 'contactNumber'])),
      set({}, 'nationality', get(input, ['contactDetails', 'cc'])),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
      set({}, 'nameTitle', get(input, ['nameTitle']))
    );
    return this;
  }
}

export interface GuestDetailsConfigI {
  salutation: FieldSchema;
  firstName: FieldSchema;
  lastName: FieldSchema;
  email: FieldSchema;
  phone: FieldSchema;
  country: FieldSchema;
}
