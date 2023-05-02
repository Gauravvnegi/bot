import { ManageSiteStatus } from '../constant/manage-site';

export type ManageSiteResponse = {
  id: string;
  thumbnail: string;
  siteName: string;
  url: string;
  nextState: ManageSiteStatus[];
  expiryDate: number;
  status: ManageSiteStatus;
  created: number;
};

export type ManageSiteListResponse = {
  total: number;
  entityTypeCounts: {
    PUBLISHED: number;
    INACTIVE: number;
    DRAFT: number;
  };
  records: ManageSiteResponse[];
};
