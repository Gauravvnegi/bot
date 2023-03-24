import { EntityStateCounts } from '@hospitality-bot/admin/library';
import { ServiceListResponse, ServiceResponse } from '../types/response';

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
  entityStateCounts: EntityStateCounts;

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

    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    return this;
  }
}
