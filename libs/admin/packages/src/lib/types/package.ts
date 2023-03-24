export type PackageFormData = {
  name: string;
  parentId: string;
  serviceIds: string[];
  imageUrl: string;
  currency: string;
  rate: number;
  discountedCurrency: string;
  discountedPrice: number;
  discountType: string;
  discountValue: number;
  active: boolean;
  enableVisibility: string[];
};

export type PackageData = Omit<PackageFormData, 'discountedCurrency'> & {
  type: 'PACKAGE';
  source: 1;
};
