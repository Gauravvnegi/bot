import { HotelConfiguration } from '../types/hotel.type';

export class HotelResponse {
         hotel: {
           active: boolean;
           name: string;
           description: string;
           address: {};
           contact: string;
           email: string;
           imageUrls: string[];
           segment: string;
           socialPlatForms: any[];
           complimentaryAmenities: string[];
         } = {
           active: true,
           name: '',
           description: '',
           address: {},
           contact: '',
           email: '',
           imageUrls: [],
           segment: '',
           socialPlatForms: [],
           complimentaryAmenities: [],
         };
         brandId: string;
         deserialize(input: HotelConfiguration) {
           this.hotel.active = input?.status;
           this.hotel.name = input?.name;
           this.hotel.description = input?.description ?? 'test description';
           this.hotel.address = input?.address ?? {};
           this.hotel.contact = input?.contact ?? '34567888888889';
           this.hotel.email = input?.email ?? 'test@test.com';
           this.hotel.imageUrls = input.imageUrls ?? [
             'assets/images/empty-table-service.png',
           ];
           this.hotel.segment = input?.segment ?? 'bnb';
           this.hotel.socialPlatForms =  [
             {
               name: 'facebook',
               imageUrl: 'assets/images/facebook.png',
               redirectUrl: 'https://www.facebook.com',
             },
             {
               redirectUrl: 'https://www.instagram.com',
             },
             {
               redirectUrl: 'https://www.linkedIn.com',
             },
             {
               redirectUrl: 'https://www.twitter.com',
             },
             {
               redirectUrl: 'https://www.youtube.com',
             },
           ];
           this.hotel.complimentaryAmenities = input?.complimentaryAmenities;
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
    this.type = input.type;
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
