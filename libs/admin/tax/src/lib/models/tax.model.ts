import { TaxResponse, TaxListResponse,EntityStateCountsResponse } from '../types/response.type';
export class Tax {
  id: string;
  countryName: string;
  taxType: string;
  source: string;
  taxRate: string;
  status: boolean;
  deserialize(input: TaxResponse) {
    this.id = input.id;
    this.countryName = input.name;
    this.taxType = input.taxType;
    this.taxRate = input.taxRate;
    this.status = input.status;
    return this;
  }
}


export class TaxList {
  records: Tax[];
  total: number;
  entityStateCounts: EntityStateCounts;
  deserialize(input: TaxListResponse) {
    this.records = input.records.map((item) =>
      new Tax().deserialize(item)
    );
    this.total = input.total;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input.entityStateCounts
    );
    return this;
  }
}

export class EntityStateCounts {
  ALL: number;
  INACTIVE: number;
  ACTIVE: number;
  deserialize(input: EntityStateCountsResponse) {
    this.ALL = input.All;
    this.ACTIVE = input.Active;
    this.INACTIVE = input.Inactive;
    return this;
  }
}

