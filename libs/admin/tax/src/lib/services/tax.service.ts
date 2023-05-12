import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { TaxListResponse } from '../types/response.type';
import { QueryConfig } from '../types/tax';

@Injectable()
export class TaxService extends ApiService {
  /**
   * @createTax --api call to create tax
   * @param hotelId --string type
   * @param data
   * @returns
   */
  createTax(hotelId: string, data: any): Observable<any> {
    return this.post(`/api/v1/entity/${hotelId}/tax`, data);
  }
  /**
   * @getTaxCountry --to get all tax countries
   * @returns
   */
  getTaxCountry(): Observable<any> {
    return this.get('/api/v1/config?key=COUNTRYCODE');
  }

  getTaxList(
    hotelId: string,
    config?: QueryConfig
  ): Observable<TaxListResponse> {
    return this.get(`/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`);
  }

  updateTax(
    hotelId: string,
    taxId: string,
    data: any
  ): Observable<TaxListResponse> {
    return this.patch(`/api/v1/entity/${hotelId}/tax/${taxId}`, data);
  }

  getTaxById(hotelId: string, taxId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/tax/${taxId}`);
  }

  exportCSV(hotelId: string, config: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/tax/export${config.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
