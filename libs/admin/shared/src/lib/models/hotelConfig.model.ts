import { get, set } from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class HotelDetails implements Deserializable {
  hotelAccess;
  brands;

  deserialize(input) {
    Object.assign(this, set({}, 'hotelAccess', get(input, ['hotelAccess'])));

    this.brands = this.hotelAccess.chains.map((brand) =>
      new HotelBrand().deserialize(brand)
    );

    return this;
  }
}

export class HotelBrand implements Deserializable {
  id;
  label;
  name;
  value;
  branches;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'value', get(input, ['id'])),
      set({}, 'label', get(input, ['name']))
    );

    this.branches = input.hotels.map((branch) =>
      new HotelBranch().deserialize(branch)
    );

    return this;
  }
}

export class HotelBranch implements Deserializable {
  id;
  label;
  name;
  value;
  logoUrl;
  headerBgColor;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'value', get(input, ['id'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'value', get(input, ['id'])),
      set({}, 'label', get(input, ['name'])),
      set({}, 'logoUrl', get(input, ['logo'])),
      set({}, 'headerBgColor', get(input, ['bgColor']))
    );

    return this;
  }
}
