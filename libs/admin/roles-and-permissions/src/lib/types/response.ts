import { UserResponse } from '@hospitality-bot/admin/shared';

export type UserListResponse = {
  total: number;
  entityTypeCounts: {};
  entityStateCounts: {};
  records: UserResponse[];
  users?: UserResponse[];
};

export type ServiceItemUserListResponse = {
  total: number;
  entityStateCounts: {};
  records: ServiceItemUserResponse[];
};

export type ServiceItemUserResponse = {
  id: string;
  type: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  title: string;
  parentId: string;
  status: boolean;
  available: boolean;
  email: string;
};
