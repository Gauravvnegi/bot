export type ServiceFormData = {
  type: 'SERVICE';
  name: string;
  parentId: string;
  imageUrl;
  serviceType: string;
  currency: string;
  rate: number;
  unit: string;
  active: boolean;
  categoryName: string;
  enableVisibility: string[];
  taxIds: string[];
};

export type ServiceData = ServiceFormData & {
  type: 'SERVICE';
  source: 1;
};
