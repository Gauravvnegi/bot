import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class UserConfig implements Deserializable {
  permissionConfigs;
  departments;
  products;
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
  timezone;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'permissionConfigs', get(input, ['permissions'])),
      set({}, 'departments', get(input, ['departments'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'jobTitle', get(input, ['title'])),
      set({}, 'cc', this.getNationality(get(input, ['cc']))),
      set({}, 'phoneNumber', get(input, ['phoneNumber'])),
      set({}, 'profileUrl', get(input, ['profileUrl'])),
      set({}, 'email', get(input, ['email']))
    );
    const length = input?.hotelAccess?.chains[0]?.hotels.length;
    this.brandName = input?.hotelAccess?.chains[0]?.id;
    this.branchName = input?.hotelAccess?.chains[0]?.hotels[length - 1]?.id;
    this.timezone = input?.hotelAccess?.chains[0]?.hotels[length - 1]?.timezone;

    this.products = this.departments.map(({ productLabel, productType }) => ({
      label: productLabel,
      value: productType,
    }));

    this.products = [
      ...new Map(this.products.map((item) => [item['label'], item])).values(),
    ];

    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getProfileNickName() {
    return `${this.firstName.slice(0, 1)}${(this.lastName || '').slice(0, 1)}`;
  }

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}
