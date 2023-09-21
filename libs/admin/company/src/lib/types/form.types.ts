import { AdditionalFeature } from './response';

export type CompanyFormType = AdditionalFeature & {
  status: boolean;
  name: string;
  email: string;
  cc: string;
  phoneNo: string;
  address: string;
  salePersonName?: string;
  salePersonCC: string;
  salePersonNo?: string;
  discountType: string;
  discount: string;
};
