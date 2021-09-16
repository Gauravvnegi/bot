import { get, set } from 'lodash';
import { GuestRole, GuestTypes } from '../constants/guest';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(input: any): this;
}

export class GuestDetailDS implements Deserializable {
  guests: Guest[];

  deserialize(input: any) {
    this.guests = new Array<Guest>();
    input.primaryGuest &&
      this.guests.push(
        new Guest().deserialize({
          ...input.primaryGuest,
          ...{
            type: GuestTypes.primary,
            label: 'Primary Guest',
            role: GuestRole.undefined,
          },
        })
      );
    input.sharerGuests &&
      input.sharerGuests.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Sharer',
              role: GuestRole.sharer,
            },
          })
        );
      });
    input.accompanyGuests &&
      input.accompanyGuests.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Accompanied / Kids',
              role: GuestRole.accompany,
            },
          })
        );
      });
    input.kids &&
      input.kids.forEach((guest) => {
        this.guests.push(
          new Guest().deserialize({
            ...guest,
            ...{
              type: GuestTypes.secondary,
              label: 'Accompanied / Kids',
              role: GuestRole.kids,
            },
          })
        );
      });
    return this;
  }
}

export class Guest implements Deserializable {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  nationality: string;
  email: string;
  nameTitle: string;
  type: string;
  label: string;
  role: string;
  age: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'mobileNumber', get(input, ['contactDetails', 'contactNumber'])),
      set(
        {},
        'nationality',
        this.getNationality(get(input, ['contactDetails', 'cc']))
      ),
      set({}, 'email', get(input, ['contactDetails', 'emailId'])),
      set({}, 'nameTitle', get(input, ['nameTitle'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'role', get(input, ['role'])),
      set({}, 'age', get(input, ['age']))
    );
    return this;
  }

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
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
