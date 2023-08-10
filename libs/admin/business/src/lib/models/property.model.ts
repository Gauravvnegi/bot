import { EntityResponse } from '../types/entity-response.type';

export class EntityList {
  records: Entity[] = [];
  total: number;

  deserialize(input) {
    this.records = input?.records.map((x) => new Entity().deserialize(x));
    this.total = input?.total;
    return this;
  }
}

export class Entity {
  id: string;
  category: string;
  name: string;
  imageUrl;
  logo: string;
  address;
  timezone: string;
  redirectionParameter: object;
  socialPlatforms;
  showAddress: boolean;
  contact;
  description: string;
  emailId: string;
  status: boolean;
  parentId: string;
  url: string;
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
  propertyCategory?;

  deserialize(input: EntityResponse) {
    this.id = input?.id;
    this.category = input?.category;
    this.name = input?.name;
    this.imageUrl = input?.imageUrl;
    this.address = input?.address;
    this.timezone = input?.timezone;
    this.redirectionParameter = input?.redirectionParameter;
    this.socialPlatforms = input?.socialPlatforms;
    this.showAddress = input?.showAddress;
    this.contact = input?.contact;
    this.description = input?.description;
    this.emailId = input?.emailId;
    this.status = input?.status === 'ACTIVE';
    this.parentId = input?.parentId;
    this.url = input?.absoluteRoute;
    this.minimumOccupancy = input?.minimumOccupancy;
    this.dayOfOperationStart = input?.dayOfOperationStart;
    this.dayOfOperationEnd = input?.dayOfOperationEnd;
    this.timeDayStart = input?.timeDayStart;
    this.timeDayEnd = input?.timeDayEnd;
    this.area = input?.area;
    this.dimension = input?.dimension;
    this.type = input?.type;
    this.subType = input?.subType;
    this.cuisinesType = input?.cuisinesType;
    this.maximumOccupancy = input?.maximumOccupancy;
    this.propertyCategory = input?.propertyCategory;

    return this;
  }
}
