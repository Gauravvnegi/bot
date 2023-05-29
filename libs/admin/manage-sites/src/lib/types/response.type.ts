import { ManageSiteStatus } from '../constant/manage-site';

export type ManageSiteResponse = {
  id: string;
  favIcon: string;
  name: string;
  domain: string;
  themeId: string;
  nextState: ManageSiteStatus[];
  status: ManageSiteStatus;
  socialPlatforms: any[];
};

export type ManageSiteListResponse = {
  total: number;
  entityTypeCounts: {
    PUBLISHED: number;
    DRAFT: number;
    TRASH: number;
  };
  records: ManageSiteResponse[];
};
