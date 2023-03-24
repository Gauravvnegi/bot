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
  expiryDate: number;
  status: ManageSiteStatus;
  created: number;

  deserialize(input: ManageSiteResponse) {
    this.id = input.id;
    this.thumbnail = input.thumbnail;
    this.siteName = input.siteName;
    this.url = input.url;
    this.expiryDate = input.expiryDate;
    this.status = input.status;
    this.created = input.created;

    return this;
  }
}

export class ManageSiteList {
  total: number;
  entityTypeCounts: Record<ManageSiteStatus, number>;
  records: ManageSite[];

  deserialize(input: ManageSiteListResponse) {
    this.total = input.total;

    this.records =
      input.records.map((item) => new ManageSite().deserialize(item)) ?? [];

    this.entityTypeCounts = {
      DRAFT: input.entityTypeCounts.DRAFT,
      PUBLISHED: input.entityTypeCounts.PUBLISHED,
      INACTIVE: input.entityTypeCounts.INACTIVE,
    };

    return this;
  }
}
