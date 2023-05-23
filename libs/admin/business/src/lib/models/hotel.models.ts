import { get } from 'lodash';
import { SocialPlatForms } from '../types/brand.type';
import { HotelConfiguration } from '../types/hotel.type';

export class HotelResponse {
  hotel: {
    id: string;
    status: boolean;
    name: string;
    description: string;
    contact: string;
    emailId: string;
    imageUrl: string[];
    propertyCategory: string;
    socialPlatforms: SocialPlatForms[];
    serviceIds: string[];
  } = {
    id: '',
    status: true,
    name: '',
    description: '',
    contact: '',
    emailId: '',
    imageUrl: [],
    propertyCategory: '',
    socialPlatforms: [],
    serviceIds: [],
  };
  brandId: string;
  deserialize(input) {
    this.hotel.status = input?.status;
    this.hotel.name = input?.name;
    this.hotel.description = input?.description;
    this.hotel.contact = input?.contact;
    this.hotel.emailId = input?.emailId;
    this.hotel.imageUrl = input?.imageUrl;
    this.hotel.propertyCategory = input.propertyCategory.value;
    this.hotel.socialPlatforms = input?.socialPlatforms ?? [];
    this.hotel.serviceIds = input?.serviceIds ?? [];
    this.brandId = input?.id;
    return this;
  }
}
export class Services {
  services = new Array<Service>();

  deserialize(input) {
    input.forEach((x) => {
      this.services.push(new Service().deserialize(x));
    });

    return this;
  }
}

export class Service {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  rate?: string;
  deserialize(input) {
    this.id = input.id;
    this.name = input.name;
    this.imageUrl = input.imageUrl;
    this.type = input.serviceType;
    this.rate = `${input.currency}${input.rate}`;
    return this;
  }
}

export const noRecordAction = {
  actionName: '+Create New Service',
  link: '/pages/library/services/create-service',
  imageSrc: 'assets/images/empty-table-service.png',
  description:
    'No services found. Tap the +Create Services to create & manage the services offered by your hotel',
};

export class SegmentList {
  segmentList = new Array<any>();

  deserialize(input) {
    input.category.forEach((x) => {
      this.segmentList.push(new Segment().deserialize(x));
    });

    return this;
  }
}

export class Segment {
  label: string;
  value: string;
  icon: string;
  iconCount: number;
  deserialize(input) {
    this.label = input.label.split('_').join(' ');
    this.value = input.value;
    this.icon = this.getIcon(input.label[0]);
    this.iconCount = input.label[0];
    return this;
  }

  getIcon(value) {
    switch (value) {
      case '2':
        return 'assets/images/2.svg';
      case '3':
        return 'assets/images/3 star.svg';
      case '4':
        return 'assets/images/4 star.svg';
      case '5':
        return 'assets/images/5star.svg';
    }
  }
}

export class ServiceIdList {
  serviceIdList = new Array<any>();

  deserialize(input) {
    input.services.forEach((x) => {
      this.serviceIdList.push(x.id);
    });

    return this;
  }
}
