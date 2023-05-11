import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class BrandService extends ApiService {
  /**
   * @function getBrandList
   * @description get brand list
   * @returns
   */

  createBrand(data: any): Observable<any> {
    console.log('data', data);
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
  getBrandById(id: string): Observable<any> {
    return this.get(`/api/v1/brand/${id}`);
  }

  /**
   * @function updateBrand
   * @description update brand by id
   * @param brandId
   * @param data
   * @returns
   */

  updateBrand(brandId: string, data: any): Observable<any> {
    return this.put(`/api/v1/brand/${brandId}`, data);
  }

  /**
   * @function getSocialMediaConfig
   * @description get social media config
   * @returns
   */
  getSocialMediaConfig(): Observable<any> {
    return this.get(`/api/v1/config?key=SOCIAL_MEDIA_CONFIGURATION`);
  }
}

