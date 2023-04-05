import {
  TaxCategoriesResponse,
  TaxCountryResponse,
  TaxRateResponse,
  TaxTypeResponse,
} from 'libs/admin/shared/src/lib/types/response';
import {
  TaxResponse,
  TaxListResponse,
  EntityStateCountsResponse,
} from '../types/response.type';

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
  entityStateCounts: EntityStateCounts;
  deserialize(input: TaxListResponse) {
    this.records =
      input?.records?.map((item) => new Tax().deserialize(item)) ?? [];
    this.total = input?.total ?? 0;
    this.entityStateCounts = new EntityStateCounts().deserialize(
      input?.entityStateCounts
    );
    return this;
  }
}

export class EntityStateCounts {
  ALL: number;
  INACTIVE: number;
  ACTIVE: number;
  deserialize(input: EntityStateCountsResponse) {
    this.ALL = input?.All ?? 0;
    this.ACTIVE = input?.Active ?? 0;
    this.INACTIVE = input?.Inactive ?? 0;
    return this;
  }
}

export class TaxRate {
  value: number;
  label: string;
  deserialize(input: TaxRateResponse) {
    this.label = input?.name ?? '';
    this.value = input?.value ?? 0;
    return this;
  }
}

export class Categories {
  value: string;
  label: string;
  taxRate?: TaxRate[];
  deserialize(input: TaxCategoriesResponse) {
    this.label = input?.name ?? '';
    this.value = input?.value ?? '';
    if (input?.tax) {
      this.taxRate = input.tax.map((item) => new TaxRate().deserialize(item));
    }
    return this;
  }
}

export class TaxType {
  value: string;
  label: string;
  categories?: Categories[];
  deserialize(input: TaxTypeResponse) {
    this.value = input?.value ?? '';
    this.label = input?.name ?? '';
    if (input?.categories) {
      this.categories = input.categories.map((item) =>
        new Categories().deserialize(item)
      );
    }
    return this;
  }
}

export class TaxCountry {
  label: string;
  value: string;
  icon: string;
  taxType?: TaxType[];
  deserialize(input: TaxCountryResponse) {
    this.label = input?.countryName ?? '';
    this.value = input?.countryName ?? '';
    this.icon = input?.srcImg ?? '';
    if (input?.taxType) {
      this.taxType = input.taxType.map((item) =>
        new TaxType().deserialize(item)
      );
    }
    return this;
  }
}

export class TaxCountryList {
  records: TaxCountry[];
  deserialize(input: TaxCountryResponse[]) {
    this.records =
      input?.map((item) => new TaxCountry().deserialize(item)) ?? [];
    return this;
  }
}
