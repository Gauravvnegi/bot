import { EntityState } from '@hospitality-bot/admin/shared';

export type RequestItemUser = {
  id: string;
  entityId: string;
  userId: string;
  active: boolean;
  firstName: string;
  lastName: string;
};

export type ServiceItemResponse = {
  id: string;
  itemCode: string;
  category: {
    name: string;
  };
  itemName: string;
  active: boolean;
  entityId: string;
  location: false;
  quantity: false;
  time: false;
  requestItemUsers: RequestItemUser[];
  remarks: string;
  sla: number;
  reservationServiceStats: {
    itemId: string;
    total: string;
    closedJobs: string;
    openJobs: string;
  };
};

export type ServiceItemListResponse = {
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  records: ServiceItemResponse[];
  total: number;
};

//open/total