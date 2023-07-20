export type OutletResponse = {
  id: string;
  category: string;
  name: string;
  imageUrl: Image[];
  logo: string;
  address: Address;
  timezone: string;
  redirectionParameter: {};
  socialPlatforms: any[];
  showAddress: boolean;
  contact: Contact;
  description: string;
  emailId: string;
  status: string;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  dimension: string;
  type: string;
  subType: string;
  parentId: string;
};

type Image = {
  url: string;
  isFeatured: boolean;
};

export type Contact = {
  countryCode: string;
  phoneNumber: string;
};

export type Address = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  pincode: number;
  formattedAddress: string;
  state: string;
  postalCode: string;
} & Record<string, any>;
