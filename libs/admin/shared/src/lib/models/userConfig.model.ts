import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class UserConfig implements IDeserializable {
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
  timezone;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'permissionConfigs', get(input, ['permissions'])),
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

export class UserList {
  list: User[];

  deserialize(input) {
    this.list = new Array<User>();
    input.forEach((item) => this.list.push(new User().deserialize(item)));
    return this.list;
  }
}

export class User {
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  department: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'], '')),
      set({}, 'firstName', get(input, ['firstName'], '')),
      set({}, 'lastName', get(input, ['lastName'], '')),
      set({}, 'department', get(input, ['department'], 'Hotel Admin'))
    );
    this.name = `${this.firstName} ${this.lastName ? this.lastName + ' ' : ''}`;
    return this;
  }
}

export class DepartmentList {
  list: Department[];

  deserialize(input) {
    this.list = new Array<Department>();
    input.forEach((item) => this.list.push(new Department().deserialize(item)));
    return this.list;
  }
}

export class Department {
  name: string;
  departmentLabel: string;
  departmentName: string;
  department: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['departmentLabel'], '')),
      set({}, 'departmentName', get(input, ['departmentName'], '')),
      set({}, 'departmentLabel', get(input, ['departmentLabel'], '')),
      set({}, 'department', get(input, ['department'], 'Hotel Department'))
    );
    return this;
  }
}
