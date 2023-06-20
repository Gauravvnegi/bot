import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgentListResponse, AgentResponseType } from '../types/response';
import { QueryConfig } from '../types/agent';
import { companyResponse } from '../../../../company/src/lib/constants/response';
import { dataList } from '../constant/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';

@Injectable({
  providedIn: 'root',
})
export class AgentService extends ApiService {
  data: AgentListResponse;

  addAgent(
    data: AgentResponseType,
    config?: QueryConfig
  ): Observable<AgentResponseType> {
    return this.post(`api/v1/members${config.params}`, data);
  }

  updateAgent(
    data: AgentResponseType,
    companyId: string,
    config?: QueryConfig
  ): Observable<AgentResponseType> {
    return this.patch(`/api/v1/members/${companyId}${config.params}`, data);
  }

  getAgentList(config?: QueryConfig): Observable<AgentListResponse> {
    return this.get(`/api/v1/members/${config.params}`);
  }

  getCompanyList(config?: QueryConfig): Observable<CompanyResponseType[]> {
    return this.get(`/api/v1/members/${config.params}`);
  }

  getAgentById(
    agentId: string,
    config?: QueryConfig
  ): Observable<AgentResponseType> {
    return this.get(`/api/v1/members/${agentId}${config.params}`);
  }
  updateAgentStatus(agentid, config: QueryConfig): Observable<any> {
    return this.patch(`/api/v1/members/${agentid}${config.params}`, {});
  }

  exportCSV(config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/members/export${config.params}`, {
      responseType: 'blob',
    });
  }
}
