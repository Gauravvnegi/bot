import { ManageSiteStatus } from '../constant/manage-site';
import {
  ManageSiteListResponse,
  ManageSiteResponse,
} from '../types/response.type';

export class ManageSite {
  id: string;
  thumbnail: string;
  siteName: string;
  url: string;
  nextState: ManageSiteStatus[];
  status: ManageSiteStatus;

  deserialize(input: ManageSiteResponse) {
    this.id = input.id;
    this.thumbnail = input.logo;
    this.siteName = input.name;
    this.url = input.domain;
    this.nextState = input.nextState;
    this.status = input.status;

    return this;
  }
}

export class ManageSiteList {
  total: number;
  entityTypeCounts: ManageSiteListResponse['entityTypeCounts'];
  records: ManageSite[];

  deserialize(input: ManageSiteListResponse) {
    this.total = input.total;

    this.records =
      input.records.map((item) => new ManageSite().deserialize(item)) ?? [];

    this.entityTypeCounts = {
      DRAFT: input.entityTypeCounts.DRAFT,
      PUBLISHED: input.entityTypeCounts.PUBLISHED,
      TRASH: input.entityTypeCounts.TRASH,
    };

    return this;
  }
}
