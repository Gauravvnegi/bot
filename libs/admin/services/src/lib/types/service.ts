export type ServiceFormData = {
  type: 'SERVICE';
  name: string;
  parentId: string;
  imageUrl: string;
  serviceType: string;
  currency: string;
  rate: number;
  unit: string;
  active: boolean;
  categoryName: string;
  enableVisibility: string[];
  serviceTax: number;
};

export type ServiceData = ServiceFormData & {
  type: 'SERVICE';
  source: 1;
};
