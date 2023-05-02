import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class HotelDetails implements IDeserializable {
  hotelAccess;
  brands;

  deserialize(input) {
    Object.assign(this, set({}, 'hotelAccess', get(input, ['hotelAccess'])));

    this.brands =
      this.hotelAccess &&
      this.hotelAccess?.chains?.map((brand) =>
        new HotelBrand().deserialize(brand)
      );
    return this;
  }
}

export class HotelBrand implements IDeserializable {
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

export class HotelBranch implements IDeserializable {
  id;
  label;
  name;
  value;
  logoUrl;
  headerBgColor;
  nationality;
  timezone: string;
  outlets;
  websiteUrl;
  pmsEnable: boolean;
  deserialize(input) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'value', get(input, ['name'])),
      set({}, 'label', get(input, ['name'])),
      set({}, 'logoUrl', get(input, ['logo'])),
      set({}, 'headerBgColor', get(input, ['bgColor'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'timezone', get(input, ['timezone'])),
      set({}, 'outlets', get(input, ['outlets'])),
      set({}, 'websiteUrl', get(input, ['websiteUrl'])),
      set({}, 'pmsEnable', get(input, ['pmsEnable']))
    );

    return this;
  }
}
