import { UserResponse } from '@hospitality-bot/admin/shared';
import {
  ServiceItemUserListResponse,
  ServiceItemUserResponse,
  UserListResponse,
} from '../types/response';
export interface IDeserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class User {
  firstName: string;
  lastName: string;
  jobTitle: string;

  cc: string;
  phoneNumber: string;
  email: string;
  profileUrl: string;
  userId: string;
  parentId: string;

  status: boolean;

  reportingTo: string;
  availableStatus: {
    label: string;
    value: boolean;
    type: string;
  };
  contactNumber: string;
  deserialize(input: UserResponse) {
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.jobTitle = input.title;

    this.cc = input?.cc;
    this.phoneNumber = input.phoneNumber;
    this.email = input.email;
    this.profileUrl = input.profileUrl;
    this.userId = input.id;
    this.parentId = input.parentId;

    this.status = input.status;

    this.reportingTo = input?.reportingTo;
    this.availableStatus = {
      label: input?.available ? 'Available' : 'Unavailable',
      value: input?.available,
      type: input.available ? 'success' : 'failed',
    };
    this.contactNumber = `${input.cc} ${input.phoneNumber}`;
    return this;
  }

  createServiceItem(input: ServiceItemUserResponse) {
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.jobTitle = input.title;

    this.phoneNumber = input.phoneNumber;
    this.email = input.email;
    this.userId = input.id;
    this.parentId = input.parentId;

    this.status = input.status;
    this.cc = input?.cc;

    this.availableStatus = {
      label: input?.available ? 'Available' : 'Unavailable',
      value: input?.available,
      type: input.available ? 'success' : 'failed',
    };
    this.contactNumber = `${input.cc} ${input.phoneNumber}`;

    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getContactDetails() {
    return `${this.cc} ${this.phoneNumber}`;
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

export class ServiceItemUserList {
  records: User[];
  entityStateCounts: {};
  totalRecords: number;

  deserialize(input: ServiceItemUserListResponse) {
    this.records = input.records.map((record) =>
      new User().createServiceItem(record)
    );
    this.entityStateCounts = input.entityStateCounts;
    this.totalRecords = input.total;
    return this;
  }
}
