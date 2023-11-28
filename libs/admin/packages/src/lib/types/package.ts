export type PackageFormData = {
  name: string;
  parentId: string;
  serviceIds: string[];
  imageUrl;
  currency: string;
  rate: number;
  discountedCurrency: string;
  discountedPrice: number;
  discountType: string;
  discountValue: number;
  active: boolean;
  enableVisibility: string[];
  priority: string;
  enableOnMicrosite: boolean;
  description: string;
  startDate: string;
  endDate: string;
};

export type PackageData = Omit<PackageFormData, 'discountedCurrency'> & {
  type: 'PACKAGE';
  source: 1;
};
