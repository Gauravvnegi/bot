import { Department, HotelAccess } from ".";

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  otpVerified: boolean;
  cc: string;
  phoneNumber: string;
  profileUrl: string;
  permissions: {
    entity: string;
    label: string;
    permissions: {
      manage: -1 | 0 | 1;
      view: -1 | 0 | 1;
    };
    productType: string;
  }[];

  parentId: string;
  status: boolean;
  departments: Department[];

  agent: boolean;
  hotelAccess: HotelAccess;
};

export type UserListResponse = {
  total: number;
  entityTypeCounts: {};
  records: UserResponse[];
};
