import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionService extends ApiService {
  getSubscriptionPlan(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/subscriptions/current-plan`);
  }

  getSubscriptionUsage(entityId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/subscriptions/usage/${config.queryObj}`
    );
  }

  getSubscriptionUsagePercentage(entityId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/subscriptions/usage/percentage/${config.queryObj}`
    );
  }

  exportCSV(entityId, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/subscriptions/exportcsv/${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  getFrontdeskStats(config): Observable<any> {
    return this.get(`/api/v1/subscription-stats${config.queryObj}`);
  }

  getMessagesExchangedStats(config): Observable<any> {
    return this.get(`/api/v1/subscription-stats/messages${config.queryObj}`);
  }

  getFeedbackReceivedStats(config): Observable<any> {
    return this.get(`/api/v1/subscription-stats/feedback${config.queryObj}`);
  }
}
