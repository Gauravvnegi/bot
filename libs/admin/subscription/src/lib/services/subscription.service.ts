import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionService extends ApiService {
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscriptions/current-plan`);
  }

  getSubscriptionUsage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/${config.queryObj}`
    );
  }

  getSubscriptionUsagePercentage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/percentage/${config.queryObj}`
    );
  }

  exportCSV(hotelId, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/exportcsv/${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  getFrontdeskStats(config): Observable<any> {
    return this.get(`/api/v1/subscription-stats${config.queryObj}`);
  }
}
