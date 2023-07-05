import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { TaxListResponse } from '../types/response.type';
import { QueryConfig } from '../types/tax';

@Injectable()
export class TaxService extends ApiService {
  /**
   * @createTax --api call to create tax
   * @param entityId --string type
   * @param data
   * @returns
   */
  createTax(entityId: string, data: any): Observable<any> {
    return this.post(`/api/v1/entity/${entityId}/tax`, data);
  }
  /**
   * @getTaxCountry --to get all tax countries
   * @returns
   */
  getTaxCountry(): Observable<any> {
    return this.get('/api/v1/config?key=COUNTRYCODE');
  }

  getTaxList(
    entityId: string,
    config?: QueryConfig
  ): Observable<TaxListResponse> {
    return this.get(`/api/v1/entity/${entityId}/tax${config?.params ?? ''}`);
  }

  updateTax(
    entityId: string,
    taxId: string,
    data: any
  ): Observable<TaxListResponse> {
    return this.patch(`/api/v1/entity/${entityId}/tax/${taxId}`, data);
  }

  getTaxById(entityId: string, taxId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/tax/${taxId}`);
  }

  exportCSV(entityId: string, config: QueryConfig) {
    return this.get(
      `/api/v1/entity/${entityId}/tax/export${config.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
