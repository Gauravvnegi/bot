import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class UserConfig implements Deserializable {
  permissionConfigs;
  firstName;
  lastName;
  jobTitle;
  brandName;
  branchName;
  cc;
  phoneNumber;
  email;
  profileUrl;
  id;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'permissionConfigs', get(input, ['permissions'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'jobTitle', get(input, ['title'])),
      set({}, 'cc', get(input, ['cc'])),
      set({}, 'phoneNumber', get(input, ['phoneNumber'])),
      set({}, 'profileUrl', get(input, ['profileUrl'])),
      set({}, 'email', get(input, ['email']))
    );
    this.brandName = input.hotelAccess.chains[0].id;
    this.branchName = input.hotelAccess.chains[0].hotels[0].id;
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getProfileNickName() {
    return `${this.firstName.slice(0, 1)}${this.lastName.slice(0, 1)}`;
  }
}
