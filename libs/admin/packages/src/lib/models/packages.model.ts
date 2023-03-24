import { EntityStateCounts } from '@hospitality-bot/admin/library';
import { PackageListResponse, PackageResponse } from '../types/response';

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
    this.category = input.categoryName;

    return this;
  }
}

export class PackageList {
  records: Package[];
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: PackageListResponse) {
    this.records = input.paidPackages?.map((item) =>
      new Package().deserialize(item)
    );
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    return this;
  }
}
