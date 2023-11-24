import { Injectable } from '@angular/core';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NightAuditResponse } from '../types/night-audit.type';
import { UserListResponse } from 'libs/admin/roles-and-permissions/src/lib/types/response';
import { AuditSummaryResponse } from '../components/night-audit/types/audit-summary.type';

@Injectable({
  providedIn: 'root',
})
export class NightAuditService extends ApiService {
  remainingAudit = new Subject<number[]>();
  $checkedInLoading = new BehaviorSubject<boolean>(true);
  $checkedOutLoading = new BehaviorSubject<boolean>(true);
  $moveBackStateDisable = new Subject();

  getNightAudit(
    entityId: string,
    config?: QueryConfig
  ): Observable<NightAuditResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/audits/checks${config?.params}`
    );
  }

  checkAudit(entityId: string, config?: QueryConfig): Observable<number[]> {
    if (!config) {
      const auditDate = new Date();
      auditDate.setDate(auditDate.getDate() - 1);
      auditDate.setHours(23, 59, 59);
      config = {
        params: `?toDate=${auditDate.getTime()}`,
      };
    }
    return this.get(
      `/api/v1/entity/${entityId}/audits/pending${config?.params}`
    );
  }

  getAllUsers(
    entityId: string,
    config?: QueryConfig
  ): Observable<UserListResponse> {
    return this.get(`/api/v1/entity/${entityId}/users${config?.params}`);
  }

  getAuditSummary(
    entityId,
    config?: QueryConfig
  ): Observable<AuditSummaryResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/audits/perform${config?.params}`
    );
  }

  updateBookingStatus(
    bookingId: string,
    entityId: string,
    bookingType: string,
    data: { reservationType: string }
  ): Observable<any> {
    return this.patch(
      `/api/v1/booking/${bookingId}/status?type=${bookingType}&entityId=${entityId}`,
      data
    );
  }
}
