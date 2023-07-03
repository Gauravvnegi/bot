import { PackageListResponse, PackageResponse } from '../types/response';
import { EntityState } from '@hospitality-bot/admin/shared';

export class Package {
  id: string;
  name: string;
  code: string;
  source: string;
  amount: number;
  discountedPrice: number;
  currency: string;
  unit: string;
  category: string;
  status: boolean;

  deserialize(input: PackageResponse) {
    this.id = input.id;
    this.name = input.name;
    this.code = input.packageCode;
    this.source = input.source;
    this.amount = input.rate;
    this.discountedPrice = input.discountedPrice;
    this.currency = input.currency;
    this.unit = input.unit;
    this.status = input.active;
    this.category = input.category;

    return this;
  }
}

export class PackageList {
  records: Package[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: PackageListResponse) {
    this.records = input.paidPackages?.map((item) =>
      new Package().deserialize(item)
    );
    this.total = input.total;
    this.entityStateCounts = input.entityStateCounts;
    this.entityTypeCounts = input.entityTypeCounts;
    return this;
  }
}
