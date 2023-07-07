import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { AgentListResponse, AgentTableResponse } from '../types/response';
import { QueryConfig } from '../types/agent';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';

@Injectable({
  providedIn: 'root',
})
export class AgentService extends ApiService {
  data: AgentListResponse;

  addAgent(
    data: AgentTableResponse,
    config?: QueryConfig
  ): Observable<AgentTableResponse> {
    return this.post(`/api/v1/members${config.params}`, data);
  }

  updateAgent(
    data: AgentTableResponse,
    agentId: string
  ): Observable<AgentTableResponse> {
    return this.patch(`/api/v1/members/${agentId}`, data);
  }

  getAgentList(config?: QueryConfig): Observable<AgentListResponse> {
    return this.get(`/api/v1/members/${config?.params}`);
  }

  getCompanyList(config?: QueryConfig): Observable<CompanyResponseType[]> {
    return this.get(`/api/v1/members/${config?.params}`);
  }

  getAgentById(
    agentId: string,
    config?: QueryConfig
  ): Observable<AgentTableResponse> {
    return this.get(`/api/v1/members/${agentId}${config?.params}`);
  }
  updateAgentStatus(
    data: { agentId: string; status: boolean },
    config: QueryConfig
  ): Observable<any> {
    return this.patch(`/api/v1/members/${data.agentId}${config?.params}`, {
      status: data.status,
    });
  }

  exportCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/members/export${config?.params}`, {
      responseType: 'blob',
    });
  }
}
