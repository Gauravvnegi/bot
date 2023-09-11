import {
  ServiceListResponse,
  ServiceResponse,
  TaxListResponse,
  TaxResponse,
} from '../types/response';
import { EntityState } from '@hospitality-bot/admin/shared';

export class Service {
  id: string;
  name: string;
  code: string;
  source: string;
  type: string;
  amount: number;
  currency: string;
  category: string;
  status: boolean;
  unit: string;

  deserialize(input: ServiceResponse) {
    this.id = input.id;
    this.name = input.name;
    this.code = input.packageCode;
    this.source = input.source;
    this.type = input.type;
    this.amount = input.rate;
    this.currency = input.currency;
    this.category = input.categoryName;
    this.status = input.active;
    this.unit = input.unit;
    return this;
  }
}

export class ServiceList {
  allService: Service[];
  paidService: Service[];
  complimentaryService: Service[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;

  deserialize(input: ServiceListResponse) {
    this.allService =
      input.services?.map((item) => new Service().deserialize(item)) ?? [];

    this.paidService =
      input.paidPackages?.map((item) => new Service().deserialize(item)) ?? [];

    this.complimentaryService =
      input.complimentaryPackages?.map((item) =>
        new Service().deserialize(item)
      ) ?? [];

    this.total = input.total;
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    return this;
  }
}
export class Tax {
  id: string;
  countryName: string;
  taxType: string;
  category: string;
  taxRate: string;
  status: boolean;
  deserialize(input: TaxResponse) {
    this.id = input?.id ?? '';
    this.countryName = input?.country ?? '';
    this.taxType = input?.taxType ?? '';
    this.category = input?.category ?? '';
    this.taxRate = input?.taxValue ?? '';
    this.status = input?.status ?? true;
    return this;
  }
}

export class TaxList {
  records: Tax[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityTypeCounts: EntityState<string>;
  deserialize(input: TaxListResponse) {
    this.records =
      input?.records?.map((item) => new Tax().deserialize(item)) ?? [];
    this.total = input?.total ?? 0;
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    return this;
  }
}
