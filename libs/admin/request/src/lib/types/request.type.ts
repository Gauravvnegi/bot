export type SelectedEntityState = {
  entityState: string;
};

export type CMSUpdateJobData = {
  jobID: string;
  roomNo: string | number;
  lastName: string;
  action?: 'Todo';
};
