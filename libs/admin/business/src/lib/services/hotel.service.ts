import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {HotelConfiguration, HotelFormData} from './../types/hotel.type'
import { BrandFormData } from '../types/brand.type';

@Injectable()
export class HotelService extends ApiService {
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
    hotelId,
    config = { params: '?order=DESC&limit=5' }
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        res.records = this.data;

        return res;
      })
    );
  }
  /**
   * @function getSegments
   * @description get segments
   * @param hotelId
   * @returns
   * @memberof HotelService
   */

  getSegments(hotelId): Observable<any> {
    return this.get(`/api/v1/config`, { params: { key: 'THEME_TYPE' } });
  }

  getServices(hotelId: string, config?): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`);
  }
  /**
   * @function createHotel
   * @description create hotel
   * @param brandId
   * @param data
   * @returns
   * @memberof HotelService
   */

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
    return this.put(`/api/v1/brand/${hotelId}`, data);
  }

  /**
   * @function getHotelById
   * @description get hotel by id
   * @param hotelId
   * @returns
   * @memberof HotelService
   */

  getHotelById(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}`);
  }
}
