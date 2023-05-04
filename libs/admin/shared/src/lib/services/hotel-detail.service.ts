import { Injectable } from '@angular/core';
import { tokensConfig } from '../constants/common';
import { UserResponse } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class HotelDetailService {
  siteId: string;
  brandId: string;
  hotelId: string;

  sites: Sites[];
  brands: Brands[];
  hotels: Hotels[];

  initHotelDetails(input: UserResponse) {
    this.siteId = localStorage.getItem(tokensConfig.siteId);
    this.brandId = localStorage.getItem(tokensConfig.brandId);
    this.hotelId = localStorage.getItem(tokensConfig.hotelId);

    // hotel or brand could be empty
    this.sites = input.sites ?? [];

    this.brands =
      (!!this.sites.length
        ? this.sites.find((item) => item.id === this.siteId)?.brands
        : input.hotelAccess?.brands) ?? [];

    this.hotels =
      this.brands.find((item) => item.id === this.brandId)?.hotels ?? [];
  }

  setSiteId(siteId) {
    this.siteId = siteId;
    this.setLocalSiteId(siteId);
  }

  setLocalSiteId(currSiteId) {
    localStorage.setItem(tokensConfig.siteId, currSiteId);
  }

  getSiteId() {
    return localStorage.getItem(tokensConfig.siteId);
  }

  getHotelId() {
    return localStorage.getItem(tokensConfig.hotelId);
  }
}

type Sites = UserResponse['sites'][0];
type Brands = Sites['brands'][0];
type Hotels = Brands['hotels'][0];
