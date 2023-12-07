import { AdditionalFeature } from 'libs/admin/company/src/lib/types/response';

export type AgentFormType = AdditionalFeature & {
  status: boolean;
  agencyName: string;
  email: string;
  cc: string;
  phoneNo: string;
  iataNo?: string;
  salesPersonName: string;
  creditLimit: number;
  address: string;
  commissionType: string;
  commission: number;
};

export type GuestFormType = Omit<
  AgentFormType,
  | 'status'
  | 'agencyName'
  | 'address'
  | 'commissionType'
  | 'commission'
  | 'address'
  | 'iataNo'
> & {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: number;
  age: number;
};
