import { get, set } from 'lodash';

export class Amenities {
  compAmenities: Amenity[];
  paidAmenities: Amenity[];
  deserialize(input) {
    this.compAmenities = new Array<Amenity>();
    this.paidAmenities = new Array<Amenity>();
    input.forEach((item) => {
      item.type == 'Complimentary' &&
        this.compAmenities.push(new Amenity().deserialize(item));
      item.type == 'Paid' &&
        this.paidAmenities.push(new Amenity().deserialize(item));
    });

    return this;
  }
}

export class Amenity {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  rate?: string;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, 'id', '')),
      set({}, 'name', get(input, 'name', '')),
      set({}, 'imageUrl', get(input, 'imageUrl', '')),
      set({}, 'type', get(input, 'type', ''))
    );

    this.rate = get(input, 'currency', '') + get(input, 'rate', '');

    return this;
  }
}
