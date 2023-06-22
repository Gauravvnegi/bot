import { RestaurantForm, SpaForm, VenueForm } from '../types/outlet';

export class RestaurantFormData {
  status: string;
  name: string;
  emailId: string;
  contact;
  address;
  imageUrl;
  description: string;
  serviceIds: string[];
  socialPlatforms;
  type: string;
  subtype: string;
  cuisinesType?: string;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  areaUnit: string;
  rules;

  deserialize(input: RestaurantForm) {
    this.status = input.status;
    this.name = input.name;
    this.emailId = input.emailId;
    this.contact = input.contact;
    this.address = input.address;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.serviceIds = input.serviceIds;
    this.socialPlatforms = input.socialPlatforms;
    this.type = input.type;
    this.subtype = input.subtype;
    this.cuisinesType = input.cuisinesType;
    this.maximumOccupancy = input.maximumOccupancy;
    this.dayOfOperationStart = input.dayOfOperationStart;
    this.dayOfOperationEnd = input.dayOfOperationEnd;
    this.timeDayStart = input.timeDayStart;
    this.timeDayEnd = input.timeDayEnd;
    this.area = input.area;
    this.areaUnit = input.areaUnit;
    this.rules = input.rules;
    return this;
  }
}

export class SpaFormData {
  status: string;
  name: string;
  emailId: string;
  contact;
  address;
  imageUrl;
  description: string;
  serviceIds: string[];
  socialPlatforms;
  type: string;
  subtype: string;
  cuisinesType?: string;
  minimumOccupancy: number;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  areaUnit: string;
  rules;

  deserialize(input: SpaForm) {
    this.status = input.status;
    this.name = input.name;
    this.emailId = input.emailId;
    this.contact = input.contact;
    this.address = input.address;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.serviceIds = input.serviceIds;
    this.socialPlatforms = input.socialPlatforms;
    this.type = input.type;
    this.subtype = input.subtype;
    this.dayOfOperationStart = input.dayOfOperationStart;
    this.dayOfOperationEnd = input.dayOfOperationEnd;
    this.timeDayStart = input.timeDayStart;
    this.timeDayEnd = input.timeDayEnd;
    this.area = input.area;
    this.areaUnit = input.areaUnit;
    this.rules = input.rules;
    return this;
  }
}

export class VenueFormData {
  status: string;
  name: string;
  emailId: string;
  contact;
  address;
  imageUrl;
  description: string;
  serviceIds: string[];
  socialPlatforms;
  type: string;
  subtype: string;
  cuisinesType?: string;
  maximumOccupancy: number;
  dayOfOperationStart: string;
  dayOfOperationEnd: string;
  timeDayStart: string;
  timeDayEnd: string;
  area: string;
  areaUnit: string;
  rules;

  deserialize(input: VenueForm) {
    this.status = input.status;
    this.name = input.name;
    this.emailId = input.emailId;
    this.contact = input.contact;
    this.address = input.address;
    this.imageUrl = input.imageUrl;
    this.description = input.description;
    this.serviceIds = input.serviceIds;
    this.socialPlatforms = input.socialPlatforms;
    this.type = input.type;
    this.subtype = input.subtype;
    this.maximumOccupancy = input.maximumOccupancy;
    this.dayOfOperationStart = input.dayOfOperationStart;
    this.dayOfOperationEnd = input.dayOfOperationEnd;
    this.timeDayStart = input.timeDayStart;
    this.timeDayEnd = input.timeDayEnd;
    this.area = input.area;
    this.areaUnit = input.areaUnit;
    this.rules = input.rules;
    return this;
  }
}
