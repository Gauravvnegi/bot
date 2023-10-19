import { UserListResponse, UserResponse } from '../types/response';
import { Department, Permission, HotelAccess } from '../types';
import {
  EntityStateCounts,
  EntityTypeCounts,
} from '@hospitality-bot/admin/library';
export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class User {
  firstName: string;
  lastName: string;
  jobTitle: string;
  departments: Department[];
  cc: string;
  phoneNumber: string;
  email: string;
  profileUrl: string;
  userId: string;
  parentId: string;
  hotelAccess: HotelAccess;
  status: boolean;
  permissionConfigs: Permission[];
  reportingTo: string;
  deserialize(input: UserResponse) {
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.jobTitle = input.title;
    this.departments = input.departments;
    this.cc = input.cc;
    this.phoneNumber = input.phoneNumber;
    this.email = input.email;
    this.profileUrl = input.profileUrl;
    this.userId = input.id;
    this.parentId = input.parentId;
    this.hotelAccess = input.hotelAccess;
    this.status = input.status;
    this.permissionConfigs = input.permissions;
    this.reportingTo = input?.reportingTo;
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getContactDetails() {
    return `${this.cc} ${this.phoneNumber}`;
  }

  getBrandAndBranchName() {
    if (this.hotelAccess?.brands?.length) {
      return `${this.hotelAccess.brands[0].name},${this.hotelAccess.brands[0].entities[0].name} `;
    }
    return '';
  }

  getDepartments() {
    if (this.departments.length) {
      return `${this.departments[0].departmentLabel}`;
    }
    return '';
  }

  getAvailablePermissions() {
    const availablePermissions = [];
    this.permissionConfigs.forEach((config: Permission) => {
      for (let permissionType in config.permissions) {
        if (config.permissions[permissionType] === 1) {
          availablePermissions.push(
            `${config.module.slice(0, 1).toUpperCase()}${config.module
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

  getNationality(cc: string) {
    if (cc && cc.length) {
      return cc.includes('+') ? cc : `+${cc}`;
    }
    return cc;
  }
}

export class UserPermissionTable {
  records: User[];
  entityStateCounts: {};
  entityTypeCounts: {};
  totalRecords: number;
  deserialize(input: UserListResponse) {
    this.records = input.records.map((record) =>
      new User().deserialize(record)
    );
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    this.totalRecords = input.total;
    return this;
  }
}
