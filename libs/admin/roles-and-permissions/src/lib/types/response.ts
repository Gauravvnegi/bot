import { UserResponse } from '@hospitality-bot/admin/shared';

export type UserListResponse = {
  total: number;
  entityTypeCounts: {};
  entityStateCounts: {};
  records: UserResponse[];
  users?: UserResponse[];
};
