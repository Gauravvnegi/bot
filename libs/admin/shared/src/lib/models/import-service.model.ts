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
  deserialize(input: Amenity) {
    this.id = input.id;
    this.name = input.name;
    this.imageUrl = input.images[0]?.url;
    this.type = input.type;
    this.rate = `${input.currency}${input.rate}`;
    return this;
  }
}

export type Amenity = {
  id: string;
  name: string;
  description: string;
  rate: number;
  startDate: number;
  endDate: number;
  active: boolean;
  currency: string;
  packageCode: string;
  images;
  source: string;
  entityId: string;
  type: string;
  unit: string;
  category: string;
  autoAccept: boolean;
  hasChild: boolean;
  parentId: string;
};
