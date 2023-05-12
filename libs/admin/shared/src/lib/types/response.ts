export type CountryCodeResponse = {
  countryName: string;
  srcImg: string;
  value: string;
};

export type TaxCountryResponse = {
  countryName: string;
  srcImg: string;
  value: string;
  taxType?: TaxTypeResponse[];
};

export type TaxCommonType = {
  name: string;
  value: string;
};

export type TaxTypeResponse = TaxCommonType & {
  categories?: TaxCategoriesResponse[];
};

export type TaxCategoriesResponse = TaxCommonType & {
  tax?: TaxRateResponse[];
};

export type TaxRateResponse = {
  name: string;
  value: number;
};
