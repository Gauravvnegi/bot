interface Address {
  id: string;
  addressLine1: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
}

interface ContactDetails {
  cc: string;
  contactNumber: string;
  emailId: string;
}

export interface GuestResponse {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  age: number;
  address: Address;
  type: string;
  isVerified: boolean;
  status: boolean;
  created: number;
  updated: number;
  gender: string;
  creditLimit: number;
  creditLimitUsed: number;
}
