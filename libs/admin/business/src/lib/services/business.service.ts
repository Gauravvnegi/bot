import { ApiService } from '@hospitality-bot/shared/utils';
import {
  BrandFormData,
  BrandResponse,
  SocialPlatForms,
} from '../types/brand.type';
import { Observable } from 'rxjs';
import { HotelConfiguration, HotelFormData } from '../types/hotel.type';
import { map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

export class BusinessService extends ApiService {
  data = [
    {
      id: 1,
      name: 'Hotel 1',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 2,
      name: 'leela',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Hotel 3',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Hotel 4',
      segment: '3 Star',
      address: 'Gurgaon',
      email: 'leela@gmail.com',
      contact: '1234567890',
      status: 'Active',
    },
  ];

  getHotelList(
    brandId: string,
    config = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v2/entity?type=HOTEL&parentId=${brandId}`
    )
  }

  /**
   * @function getBrandList
   * @description get brand list
   * @returns
   */

  createBrand(data: BrandFormData): Observable<BrandResponse> {
    return this.post(
      `/api/v2/entity/onboarding?source=CREATE_WITH&onboardingType=BRAND`,
      data
    );
  }

  /**
   * @function getBrandById
   * @description get brand by id
   * @param id
   * @returns
   */

  getBrandById(id: string): Observable<BrandResponse> {
    return this.get(`/api/v1/brand/${id}`);
  }
  /**
   * @function updateBrand
   * @description update brand by id
   * @param brandId
   * @param data
   * @returns
   */

  updateBrand(brandId: string, data: any): Observable<BrandResponse> {
    return this.patch(`/api/v1/brand/${brandId}`, data);
  }

  /**
   * @function getSegments
   * @description get segments
   * @param hotelId
   * @returns
   * @memberof HotelService
   */

  getSegments(hotelId): Observable<any> {
    return this.get(`/api/v1/config`, {
      params: { key: 'PROPERTY_CONFIGURATION' },
    });
  }

  createHotel(
    brandId: string,
    data: HotelFormData | any
  ): Observable<HotelConfiguration> {
    return this.post(
      `/api/v2/entity/onboarding?source=CREATE_WITH&onboardingType=HOTEL`,
      data
    );
  }

  /**
   * @function updateHotel
   * @description update hotel
   * @param hotelId
   * @param data
   * @returns
   * @memberof HotelService
   */

  updateHotel(hotelId: string, data: HotelFormData | any): Observable<any> {
    return this.patch(`/api/v2/entity/${hotelId}`, data);
  }

  /**
   * @function getHotelById
   * @description get hotel by id
   * @param hotelId
   * @returns
   * @memberof HotelService
   */

  getHotelById(hotelId: string): Observable<any> {
    return this.get(
      `/api/v2/entity/${hotelId}?type=HOTEL`
    );
  }

  onSubmit = new EventEmitter<boolean>(false);
  /**
   * @function getSocialMediaConfig
   * @description get social media config
   * @returns
   */
  getSocialMediaConfig(): Observable<SocialPlatForms[]> {
    return this.get(`/api/v1/config?key=SOCIAL_MEDIA_CONFIGURATION`);
  }

  getServices(hotelId: string, config?): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }
}
