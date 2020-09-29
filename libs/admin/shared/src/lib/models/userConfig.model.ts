import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class UserConfig implements Deserializable {
  permissionConfigs;
  firstName;
  lastName;
  title;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'permissionConfigs', get(input, ['permissions'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'title', get(input, ['title']))
    );

    return this;
  }
}
