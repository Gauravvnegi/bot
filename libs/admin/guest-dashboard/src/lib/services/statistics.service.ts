import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class StatisticsService extends ApiService {
  getDocumentStatistics(config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/reservation/documents${config.queryObj}`
    );
  }

  getVIPStatistics(config): Observable<any> {
    return this.get(`/api/v1/guest-stats/vip${config.queryObj}`);
  }

  getPaymentStatistics(config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/reservation/payments${config.queryObj}`
    );
  }

  getGuestStatus(config): Observable<any> {
    return this.get(`/api/v1/guest-stats/journey${config.queryObj}`);
  }

  getGuestList(config): Observable<any> {
    return this.get(
      `/api/v1/members${config.queryObj ? `${config.queryObj}&type=GUEST` : ''}`
    );
  }

  getSourceStatistics(config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/reservations/source${config.queryObj}`
    );
  }
}
