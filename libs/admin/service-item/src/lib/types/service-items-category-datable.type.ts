import { EntityState } from '@hospitality-bot/admin/shared';
type RequestItemUser = {
  id: string;
  entityId: string;
  userId: string;
  active: boolean;
};
export type CategoryResponse = {
  id: string;
  name: string;
  description: string;
  imageUrl: [];
  active: boolean;
  entityId: string;
  serviceItems: {
    id: string;
    itemCode: string;
    itemName: string;
    active: boolean;
    entityId: string;
    location: false;
    quantity: false;
    time: false;
    requestItemUsers: RequestItemUser[];
    remarks: string;
    sla: string;
  }[];
};

export type CategoryListResponse = {
  entityStateCounts: EntityState<string>;
  records: CategoryResponse[];
  total: number;
};



//open/total
