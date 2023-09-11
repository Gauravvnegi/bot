export type AgentFormType = {
  status: boolean;
  name: string;
  email: string;
  cc: string;
  phoneNo: string;
  iataNo?: string;
  company: string;
  address: string;
  commissionType: string;
  commission: number;
};

export type GuestFormType = Omit<
  AgentFormType,
  | 'status'
  | 'name'
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
