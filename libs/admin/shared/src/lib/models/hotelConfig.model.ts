import { get, set } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class HotelDetails implements IDeserializable {
  hotelAccess;
  siteAccess: SiteAccess;
  brands;
  sites: Sites;
  hotelsBrand: Record<string, string>;

  deserialize(input) {
    Object.assign(this, set({}, 'hotelAccess', get(input, ['hotelAccess'])));
    Object.assign(this, set({}, 'siteAccess', get(input, ['siteAccess'])));

    this.brands =
      this.hotelAccess &&
      this.hotelAccess?.chains?.map((brand) =>
        new HotelBrand().deserialize(brand)
      );

    this.hotelsBrand = this.hotelAccess?.chains?.reduce((prev, curr) => {
      curr.hotels.forEach((item) => {
        prev[item.id] = curr.id;
      });

      return prev;
    }, {});

    this.sites =
      this.siteAccess?.chains.reduce((prev, curr) => {
        const sites = curr.hotels.map((item) => {
          return {
            name: item.name,
            id: item.id,
            hotelBrandId: curr.id,
            hotelBrandName: curr.name,
          };
        });

        return [...prev, ...sites];
      }, []) ?? [];
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

type Sites = {
  name: string;
  id: string;
  hotelBrandId: string;
  hotelBrandName: string;
}[];

type SiteAccess = {
  chains: {
    id: string;
    name: string;
    hotels: [
      //hotels is actually a site
      {
        id: string;
        name: string;
        logo: string;
        nationality: string;
        timezone: string;
        outlets: [];
        domain: string;
        address: {
          id: string;
          country: string;
          latitude: string;
          longitude: string;
          pincode: string;
          countryCode: string;
        };
        pmsEnable: false;
      }
    ];
  }[];
};
