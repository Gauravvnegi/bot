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
    return this.post(`api/v1/members${config.params}`, data);
  }

  updateCompany(
    data: CompanyResponseType,
    companyId: string,
    config?: QueryConfig
  ): Observable<CompanyResponseType> {
    return this.patch(`/api/v1/members/${companyId}${config.params}`, data);
  }

  getCompanyById(companyId: string): Observable<CompanyResponseType> {
    return this.get(`/api/v1/members/${companyId}`);
  }

  exportCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/members/export${config.params}`, {
      responseType: 'blob',
    });
  }

  updateCompanyStatus(compoanyId, config: QueryConfig): Observable<any> {
    return this.patch(`/api/v1/members/${compoanyId}${config.params}`, {});
  }
}