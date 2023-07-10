export type OutletResponse = {
  id: string;
  status: string;
  name: string;
  emailId: string;
  contact: Contact;
  address: Address;
  imageUrl;
  description: string;
  serviceIds: string[];
  socialPlatforms;
  type: string;
  subType: string;
  cuisinesType: string;
  minimumOccupancy: number;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  dimension: string;
  rules: string;
};

export type Contact = {
  countryCode: string;
  phoneNumber: string;
};

export type Address = {
  country: string;
  pinCode: number;
  city: string;
  state: string;
} & Record<string, any>;
