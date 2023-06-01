import { EventEmitter } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import {
  BrandFormData,
  BrandResponse,
  SocialPlatForms,
} from '../types/brand.type';
import { HotelConfiguration, HotelFormData } from '../types/hotel.type';

export class BusinessService extends ApiService {
  /**
   * @function getBrandList
   * @description get brand list
   * @returns
   * @memberof BusinessService
   */

  getHotelList(brandId: string, config: QueryConfig): Observable<any> {
    console.log(config, 'config');
    return this.get(
      `/api/v2/entity?type=HOTEL&parentId=${brandId}&${
        config.params.slice(1) ?? ''
      }`
    );
  }

  resetHotelFormState() {
    this.hotelFormState = false;
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

  getSegments(): Observable<any> {
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

  updateHotel(hotelId: string, data): Observable<any> {
    return this.patch(`/api/v2/entity/${hotelId}?type=HOTEL`, data);
  }

  /**
   * @function getHotelById
   * @description get hotel by id
   * @param hotelId
   * @returns
   * @memberof HotelService
   */

  getHotelById(hotelId: string): Observable<any> {
    return this.get(`/api/v2/entity/${hotelId}?type=HOTEL`);
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

  getServices(): Observable<any> {
    return this.get(`/api/v1/config?key=SERVICE_CONFIGURATION`);
  }

  getServiceList(
    hotelId,
    config = { params: '?type=SERVICE&serviceType=ALL&limit=5' }
  ): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }
  hotelInfoFormData = {
    address: {
      value: '',
    },
    imageUrl: [],
    serviceIds: [],
  };
  hotelFormState: boolean = false;

  initHotelInfoFormData(input: any, roomTypeFormState: boolean) {
    console.log(input, 'input');
    this.hotelInfoFormData = { ...this.hotelInfoFormData, ...input };
    this.hotelFormState = roomTypeFormState;
  }

  /**
   * @function searchLibraryItem To search library item
   * @param config  Will have type and search query
   *
   */
  searchLibraryItem(hotelId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/library/search${config?.params ?? ''}`
    );
  }

  exportCSV(brandId: string, config: QueryConfig): Observable<any> {
    return this.get(`/api/v2/entity/export${config.params ?? ''}`, {
      responseType: 'blob',
    });
  }
}
