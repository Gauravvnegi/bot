import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { generateDummyData } from '../constant/response';
import { AgentListResponse, CompanyListResponse } from '../types/response';
import { QueryConfig } from '../types/agent';
import { companyResponse } from '../../../../company/src/lib/constants/response';
@Injectable({
  providedIn: 'root',
})
export class AgentService extends ApiService {
  data: AgentListResponse;

  addAgent(hotelId, data, config?: QueryConfig): Observable<any> {
    return this.post(`/api/v1/entity/${hotelId}/tax}`, data);
  }

  updateAgent(hotelId, data, config?: QueryConfig): Observable<any> {
    return this.patch(`/api/v1/entity/${hotelId}/tax}`, data);
  }

  getAgentList(hotelId, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        if (!this.data) {
          this.data = generateDummyData(5);
        }
        return this.data;
      })
    );
  }

  getCompanyList(hotelId: string, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/library?type=SERVICE&serviceType=ALL&limit=5`
    ).pipe(
      map((res) => {
        return companyResponse;
      })
    );
  }

  getAgentById(hotelId, data, config?: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        return this.data.records.find((item) => item.id === data.AgentId) ?? {};
      })
    );
  }

  updateAgentStatus(
    hotelId,
    data: { id: string; status: boolean },
    config?: QueryConfig
  ): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/tax${config?.params ?? ''}`
    ).pipe(
      map((res) => {
        this.data.records.forEach((element) => {
          if (element.id === data.id) element['status'] = data.status;
        });
      })
    );
  }

  exportCSV(hotelId, config): Observable<any> {
    return this.get(`/api/v1/outlets/export/${config.queryObj}`);
  }
}
