import { Injectable } from '@angular/core';
import { tokensConfig } from '../constants/common';
import {
  BrandConfig,
  EntityConfig,
  SiteConfig,
} from '../models/entityConfig.model';
import { UserResponse } from '../types/user.type';
import { EntitySubType } from '../types/table.type';

@Injectable({ providedIn: 'root' })
export class HotelDetailService {
  siteId: string;
  brandId: string;
  entityId: string;

  sites: SiteConfig[];
  brands: BrandConfig[];
  hotels: EntityConfig[];

  initHotelDetails(input: UserResponse) {
    this.siteId = localStorage.getItem(tokensConfig.siteId);
    this.brandId = localStorage.getItem(tokensConfig.brandId);
    this.entityId = localStorage.getItem(tokensConfig.entityId);

    // hotel or brand could be empty
    this.sites =
      input.sites?.map((site) => new SiteConfig().deserialize(site)) ?? [];

    this.brands =
      this.sites.find((item) => item.id === this.siteId)?.brands ?? [];

    this.hotels =
      this.brands.find((item) => item.id === this.brandId)?.entities ?? [];
  }

  /**
   *
   * @param businessInfo all the required tokens update
   * @param redirectUrl default will be page -> will open the page on subscription priority
   */
  updateBusinessSession(businessInfo: BusinessInfo, redirectUrl: string = '/') {
    Object.entries(businessInfo).forEach(([token, value]) => {
      localStorage.setItem(token, value);
    });

    // if redirect url is present than change the window location
    // as this will reload the website with redirect url (subscription api will needed to be get called)
    window.location.href = redirectUrl;
  }

  getSiteId() {
    return localStorage.getItem(tokensConfig.siteId);
  }

  getentityId() {
    return localStorage.getItem(tokensConfig.entityId);
  }

  /**
   * @function getPropertyList
   * @description get the all the properties list
   * @returns propertyList [{ label : '' , value : '' , type : ''} , {...} , ...}]
   * @memberof HotelDetailService
   */
  getPropertyList() {
    let propertyList = [];
    const selectedHotel = this.hotels.find((item) => item.id === this.entityId);

    if (!selectedHotel) {
      propertyList = [];
      return;
    }
    propertyList = selectedHotel.entities.map((entity) => ({
      label: entity.name,
      value: entity.id,
      type: entity.type ? entity.type : EntitySubType.ROOM_TYPE,
      id: entity.id,
    }));

    propertyList.unshift({
      label: selectedHotel.name,
      value: selectedHotel.id,
      type: selectedHotel.type || selectedHotel?.category,
      id: selectedHotel.id,
    });

    return propertyList;
  }
}

type Sites = UserResponse['sites'][0];
type Brands = Sites['brands'][0];
type Hotels = Brands['entities'][0];

type BusinessInfo = {
  [tokensConfig.accessToken]: string;
  [tokensConfig.entityId]: string;
  [tokensConfig.brandId]?: string;
  [tokensConfig.siteId]?: string;
};
