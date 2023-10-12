import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { NightAuditResponse } from '../types/night-audit.type';
import { UserListResponse } from 'libs/admin/roles-and-permissions/src/lib/types/response';

@Injectable({
  providedIn: 'root',
})
export class NightAuditService extends ApiService {
  getNightAudit(
    entityId: string,
    queryConfig?: QueryConfig
  ): Observable<NightAuditResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/audits/checks${queryConfig?.params}`
    );
  }

  getAllUsers(entityId: string, config): Observable<UserListResponse> {
    return this.get(`/api/v1/entity/${entityId}/users${config.params ?? ''}`);
  }
}
