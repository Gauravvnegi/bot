export enum TabsType {
  all = 'all',
  resident = 'Resident',
  'non-resident' = 'Non-Resident',
}
export enum ChipType {
  seated = 'SEATED',
  waitlist = 'WAITLISTED',
}

export type OutletGuest = {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  age: number;
  type: string;
  isVerified: boolean;
  status: boolean;
  code: string;
  created: number;
  updated: number;
  gender: string;
  creditLimit: number;
  creditLimitUsed: number;
};
