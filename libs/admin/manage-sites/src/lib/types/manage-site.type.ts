import { ManageSiteStatus } from '../constant/manage-site';

export type QueryConfig = {
  params: string;
};

export type NextState = {
  id: string;
  status: ManageSiteStatus;
  value: ManageSiteStatus[];
};
