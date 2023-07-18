type Address = {
  id: string;
  city?: string;
  country: string;
  latitude: number;
  longitude: number;
  pincode: number;
  formattedAddress: string;
  state: string;
  postalCode: string;
};

type ImageUrl = {
  url: string;
  isFeatured: boolean;
};

type SocialPlatform = {
  created: number;
  updated: number;
  id: string;
  name: string;
  imageUrl: string;
  redirectUrl: string;
  entityId: string;
};

type Contact = {
  countryCode: string;
  number: string;
};

type PropertyCategory = {
  label: string;
  value: string;
  icon: string;
  iconCount: string;
};

export type EntityResponse = {
  id: string;
  category: string;
  name: string;
  imageUrl: ImageUrl[];
  logo: string;
  address: Address;
  timezone: string;
  redirectionParameter: object;
  socialPlatforms: SocialPlatform[];
  showAddress: boolean;
  contact: Contact;
  description: string;
  emailId: string;
  status: string;
  parentId: string;
  route: string;
  minimumOccupancy?: number;
  dayOfOperationStart?: string;
  dayOfOperationEnd?: string;
  timeDayStart?: string;
  timeDayEnd?: string;
  area?: string;
  dimension?: string;
  type?: string;
  subType?: string;
  cuisinesType?: string[];
  maximumOccupancy?: number;
  propertyCategory?: PropertyCategory;
  absoluteRoute: string;
};

const entities: EntityResponse[] = [
  // List of entities
];
