import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaxListResponse } from '../types/response.type';

const resData: TaxListResponse = {
  records: [
    { id: '1', name: 'India', taxType: 'SGST', taxRate: '9%', status: true },
    { id: '2', name: 'India', taxType: 'CGST', taxRate: '9%', status: true },
    { id: '3', name: 'India', taxType: 'VAT', taxRate: '20%', status: true },
  ],
  total: 3,
  entityStateCounts: {
    All: 3,
    Active: 3,
    Inactive: 0,
  },
};

@Injectable()
export class TaxService extends ApiService {
  getTax(
    hotelId,
    config = '?order=DESC&type=PACKAGE&limit=5'
  ): Observable<TaxListResponse> {
    return this.get(`/api/v1/entity/${hotelId}/library${config}`).pipe(
      map((_res) => {
        return resData;
      })
    );
  }
  updateTax(
    hotelId,
    taxId = '45eb6819-1b8e-43fb-9c07-b37598253943',
    data = { status: true }
  ): Observable<TaxListResponse> {
    return this.patch(
      `/api/v1/entity/${hotelId}/library/${taxId}${'?order=DESC&type=PACKAGE&limit=5'}`,
      data
    );
  }

  exportCSV(
    hotelId = '9a43e691-a790-4e74-bb6a-d6bc8a3394e7',
    config = '?order=DESC&type=PACKAGE&limit=5'
  ) {
    return this.get(`/api/v1/entity/${hotelId}/library/export${config}`, {
      responseType: 'blob',
    });
  }
}
