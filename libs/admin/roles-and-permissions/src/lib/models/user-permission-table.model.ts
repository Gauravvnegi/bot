import { get, set } from 'lodash';
import * as moment from 'moment';
export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class UserPermissionTable implements IDeserializable {
  records: User[];
  deserialize(input: any) {
    this.records = input.records.map((record) =>
      new User().deserialize(record)
    );
    return this;
  }
}

export class User implements IDeserializable {
  firstName;
  lastName;
  jobTitle;
  cc;
  phoneNumber;
  email;
  profileUrl;
  userId;
  parentId;
  hotelAccess;
  status;
  permissionConfigs;
  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'userId', get(input, ['id'])),
      set({}, 'parentId', get(input, ['parentId'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'jobTitle', get(input, ['title'])),
      set({}, 'cc', this.getNationality(get(input, ['cc']))),
      set({}, 'phoneNumber', get(input, ['phoneNumber'])),
      set({}, 'profileUrl', get(input, ['profileUrl'])),
      set({}, 'email', get(input, ['email'])),
      set({}, 'hotelAccess', get(input, ['hotelAccess'])),
      set({}, 'status', get(input, ['status'])),
      set({}, 'permissionConfigs', get(input, ['permissions']))
    );
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getContactDetails() {
    return `${this.cc} ${this.phoneNumber}`;
  }

  getBrandAndBranchName() {
    return `${this.hotelAccess.chains[0].name},${this.hotelAccess.chains[0].hotels[0].name} `;
  }

  getAvailablePermissions() {
    const availablePermissions = [];
    this.permissionConfigs.forEach((config) => {
      for (let permissionType in config.permissions) {
        if (config.permissions[permissionType] === 1) {
          availablePermissions.push(
            `${config.entity.slice(0, 1).toUpperCase()}${config.entity
              .slice(1)
              .toLowerCase()}_${permissionType}`
          );
        }
      }
    });
    return availablePermissions;
  }

  getSecGuestDisplayConfig() {
    const permissions = this.getAvailablePermissions();
    return {
      count: permissions.length,
      displayString:
        permissions.length > 0
          ? `${permissions[0]} (+${permissions.length})`
          : '',
      permissions,
    };
  }

  getNationality(cc) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}

// export class Manager implements IDeserializable{

// }
