export type SelectedEntityState = {
  entityState: string;
};

export type CMSUpdateJobData = {
  jobID: string;
  roomNo: string | number;
  lastName: string;
  action?: 'Todo';
};

export type ServiceItemForm = {
  itemName: string;
  categoryDesc: string;
  functionCode: string;
  serviceCode: string;
  itemDesc: string;
  sla: string;
  users: string;
};

export type DepartmentResponse = {
  id: string;
  view: number;
  manage: number;
  module: string;
  department: string;
  entityId: string;
  userId: string;
  created: number;
  updated: number;
};

export type UserResponse = {
  id: string;
  entityId: string;
  userId: string;
  departments: DepartmentResponse[];
  active: boolean;
};
