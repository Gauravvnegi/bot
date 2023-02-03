import { get, set } from 'lodash';

export class Amenities {
  compAmenities: Amenity[];
  paidAmenities: Amenity[];
  deserialize(input) {
    this.compAmenities = new Array();
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
  // currency?: string;
  // price?:

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, 'id', '')),
      set({}, 'label', get(input, 'name', '')),
      set({}, 'imageUrl', get(input, 'imageUrl', '')),
      set({}, 'type', get(input, 'type', ''))
      // set({}, 'rate', get(input, 'rate', ''))
    );

    this.rate = get(input, 'currency', '') + get(input, 'rate', '');

    return this;
  }
}
