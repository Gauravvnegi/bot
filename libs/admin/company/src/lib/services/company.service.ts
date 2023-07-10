import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@hospitality-bot/shared/utils';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { CompanyListResponse, CompanyResponseType } from '../types/response';

@Injectable()
export class CompanyService extends ApiService {
  getCompanyDetails(config?: QueryConfig): Observable<CompanyListResponse> {
    return this.get(`/api/v1/members${config.params}`);
  }

  addCompany(
    data: CompanyResponseType,
    config?: QueryConfig
  ): Observable<CompanyResponseType> {
    return this.post(`/api/v1/members${config.params}`, data);
  }

  updateCompany(
    data: CompanyResponseType,
    companyId: string,
    config?: QueryConfig
  ): Observable<CompanyResponseType> {
    return this.patch(`/api/v1/members/${companyId}`, data);
  }

  getCompanyById(companyId: string): Observable<CompanyResponseType> {
    return this.get(`/api/v1/members/${companyId}`);
  }

  searchCompany(queryParams?: QueryConfig) {
    return this.get(`/api/v1/members/${queryParams.params}`);
  }

  exportCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/members/export${config.params}`, {
      responseType: 'blob',
    });
  }

  updateCompanyStatus(
    data: { companyId: string; status: boolean },
    config: QueryConfig
  ): Observable<any> {
    return this.patch(`/api/v1/members/${data.companyId}${config.params}`, {
      status: data.status,
    });
  }
}
