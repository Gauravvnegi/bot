import { get, set } from 'lodash';
import {
  IDeserializable,
  Option,
  ProductNames,
  UserResponse,
} from '@hospitality-bot/admin/shared';
import { tokensConfig } from '../constants/common';
import { PermissionModuleNames } from '../constants';

type ProductOption = Option<ProductNames>;
export type PermissionOption = {
  module: PermissionModuleNames;
  label: string;
  permissions: {
    manage: -1 | 0 | 1; // -1 is disabled that is there is nothing related to that permission
    view: -1 | 0 | 1;
  };
  productType: string;
};

export class ProductsPermissions {
  products: ProductOption[];
  permission: PermissionOption[];
  deserialize(input: UserResponse['products']) {
    this.products = new Array<ProductOption>();
    this.permission = new Array<PermissionOption>();

    input.forEach((item) => {
      this.products.push({
        label: item.label,
        value: item.module,
      });

      item.productPermissions.map((productPermissionItem) => {
        const hasPermission = this.permission.find(
          (permissionItem) =>
            permissionItem.module === productPermissionItem.module
        );

        if (hasPermission) {
          hasPermission.productType =
            hasPermission.productType + ',' + item.module;
        } else {
          this.permission.unshift({
            label: productPermissionItem.label,
            module: productPermissionItem.module,
            permissions: productPermissionItem.permissions,
            productType: item.module,
          });
        }
      });
    });

    return this;
  }
}

export class UserConfig implements IDeserializable {
  id: string;
  firstName: string;
  lastName: string;
  products: ProductsPermissions['products'];
  permissionConfigs: ProductsPermissions['permission'];
  jobTitle: string;
  brandName: string;
  branchName: string;
  siteName: string;
  cc: string;
  phoneNumber: string;
  email: string;
  profileUrl: string;
  timezone: string;
  reportingTo: string;

  deserialize(input: UserResponse) {
    const { permission, products } = new ProductsPermissions().deserialize(
      input['products']
    );

    this.id = input.id;
    this.permissionConfigs = permission;

    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.jobTitle = input.title;
    this.cc = input.cc;
    this.phoneNumber = input.phoneNumber;
    this.profileUrl = input.profileUrl;
    this.email = input.email;
    this.reportingTo = input.reportingTo;

    this.brandName = localStorage.getItem(tokensConfig.brandId);
    this.branchName = localStorage.getItem(tokensConfig.entityId);
    this.siteName = localStorage.getItem(tokensConfig.siteId);

    const brands =
      input.sites?.find((item) => item.id === this.siteName)?.brands ?? [];

    this.timezone = brands
      ?.find((item) => item.id === this.brandName)
      ?.entities?.find((item) => item.id === this.branchName)?.timezone;

    // this.products = this.departments.map(({ productLabel, productType }) => ({
    //   label: productLabel,
    //   value: productType,
    // }));
    this.products = products.sort((a, b) => a.label.localeCompare(b.label));
    return this;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getProfileNickName() {
    return `${this.firstName.slice(0, 1)}${(this.lastName || '').slice(
      0,
      1
    )}`.toUpperCase();
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

export class Hotels {
  records: Hotel[];
  total: number;
  deserialize(brands: any[]) {
    this.records = brands.map((item) => new Hotel().deserialize(item));
    this.total = brands?.length ?? 0;
    return this;
  }
}

export class Hotel {
  id: string;
  thumbnail: string;
  bgColor: string;
  name: string;
  url: string;
  expiry: number;
  status: string;

  deserialize(input) {
    this.id = input.id;
    this.name = input.name;
    this.thumbnail = input.logo;
    this.bgColor = input.bgColor;
    this.url = input.domain;
    this.expiry = input.expiry;
    this.status = 'published';
    return this;
  }
}
