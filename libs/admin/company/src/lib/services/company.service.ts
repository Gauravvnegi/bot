import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@hospitality-bot/shared/utils';
import { map } from 'rxjs/operators';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { companyResponse } from '../constants/response';

@Injectable()
export class CompanyService extends ApiService {
  getCompanyDetails(hotelId: string, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return companyResponse;
      })
    );
  }

  addCompany(hotelId: string, data, config?: QueryConfig): Observable<any> {
    return this.post(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`,
      data
    ).pipe(
      map((res) => {
        return companyResponse;
      })
    );
  }

  getCompanyById(
    hotelId: string,
    data: { companyId: number },
    config?: QueryConfig
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return companyResponse.find((item) => item.id === data.companyId) ?? {};
      })
    );
  }

  updateCompany(hotelId: string, data, config?: QueryConfig): Observable<any> {
    return this.patch(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`,
      data
    ).pipe(
      map((res) => {
        return companyResponse;
      })
    );
  }

  exportCSV(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/outlet/export`, {
      responseType: 'blob',
    });
  }

  updateOutletItem(hotelId, status): Observable<any> {
    return this.patch(`/api/v1/user/${hotelId}/sites?status=${status}`, {});
  }
}
