import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionService extends ApiService {
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/subscriptions/current-plan`);
  }

  getSubscriptionUsage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/subscriptions/usage/${config.queryObj}`
    );
  }

  getSubscriptionUsagePercentage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/subscriptions/usage/percentage/${config.queryObj}`
    );
  }

  exportCSV(hotelId, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/subscriptions/exportcsv/${config.queryObj}`,
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
