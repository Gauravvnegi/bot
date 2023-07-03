import { EntityState } from '@hospitality-bot/admin/shared';
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
    this.thumbnail = input.favIcon;
    this.siteName = input.name;
    this.url = input.domain;
    this.nextState = input.nextState;
    this.status = input.status;
    this.nextState = [...input.nextState, input.status];
    return this;
  }
}

export class ManageSiteList {
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  records: ManageSite[];

  deserialize(input: ManageSiteListResponse) {
    this.total = input.total;

    this.records =
      input.records.map((item) => new ManageSite().deserialize(item)) ?? [];

    this.entityTypeCounts = input.entityTypeCounts;
    this.entityStateCounts = input.entityStateCounts;
    return this;
  }
}
