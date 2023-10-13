import { Amenity } from '../types/service-response';

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
  active?: boolean;
  packageCode?: string;
  deserialize(input: Amenity) {
    this.id = input.id;
    this.name = input.name;

    if (input.imageUrl && input.imageUrl.length > 0)
      this.imageUrl = input.imageUrl[0].url;

    this.type = input.type;
    this.rate = `${input.currency}${input.rate}`;
    this.active = input.active;
    this.packageCode = input.packageCode;
    return this;
  }
}
