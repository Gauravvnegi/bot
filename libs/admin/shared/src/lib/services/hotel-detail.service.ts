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

/**
 * 
 * @param businessInfo all the required tokens update
 * @param redirectUrl default will be page -> will open the page on subscription priority
 */
  updateBusinessSession(businessInfo: BusinessInfo, redirectUrl: string = '/pages') {
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

  getHotelId() {
    return localStorage.getItem(tokensConfig.hotelId);
  }
}

type Sites = UserResponse['sites'][0];
type Brands = Sites['brands'][0];
type Hotels = Brands['hotels'][0];

type BusinessInfo = {
  [tokensConfig.accessToken]: string;
  [tokensConfig.hotelId]: string;
  [tokensConfig.brandId]?: string;
  [tokensConfig.siteId]?: string;
};
