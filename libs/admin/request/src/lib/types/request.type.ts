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
