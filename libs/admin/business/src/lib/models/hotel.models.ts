import { HotelInfoForm } from "../types/hotel.type";

export class HotelFormData {
         hotel: {
           name: string;
           segment: string;
           email: string;
           contact: string;
           address;
         };
         brandId: string;

         deserialize(input: HotelInfoForm, brandId: string) {

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

