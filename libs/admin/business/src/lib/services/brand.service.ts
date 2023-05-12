import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { BrandFormData, BrandResponse, SocialPlatForms } from '../types/brand.type';

@Injectable()
export class BrandService extends ApiService {
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
    return this.put(`/api/v1/brand/${brandId}`, data);
  }


}

