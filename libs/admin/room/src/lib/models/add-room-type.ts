import { get, set } from 'lodash';

export class AddRoomType {
  name: string;
  imageUrls: string[];
  roomAmenityIds: string[];
  description: string;
  currency: string;
  originalPrice: number;
  discountedPrice: number;
  maxOccupancy: number;
  maxAdult: number;
  area: number;
  status: boolean;

  deserialize(input) {
    let comp = get(input, 'compAmenities') as Array<string>;
    let paid = get(input, 'paidAmenities') as Array<string>;
    Object.assign(
      this,
      set({}, 'name', get(input, 'typeName', '')),
      set({}, 'imageUrls', get(input, 'imageUrl', '')),
      // set({}, 'roomAmenityIds', get(input, 'compAmenities', '')),
      set({}, 'description', get(input, 'message', '')),
      set({}, 'currency', get(input, 'basePriceCurrency', '')),
      set({}, 'originalPrice', get(input, 'basePrice', '')),
      set({}, 'discountedPrice', get(input, 'discountedPrice', '')),
      set({}, 'maxOccupancy', get(input, 'maxOccupancy', '')),
      set({}, 'maxAdult', get(input, 'maxAdult', '')),
      set({}, 'area', get(input, 'roomArea', '')),
      set({}, 'status', get(input, 'status', '')),

      // this.rate = get(input, 'currency', '') + get(input, 'rate', '');
      (this.roomAmenityIds = comp.concat(paid))
    );

    return this;
  }
}
