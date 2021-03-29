import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { Subscriptions } from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscriptions/`);
  }

  setSubscription(data) {
    this.subscriptions = data;
    this.subscription$.next(data);
  }

  getSubscription() {
    return this.subscriptions;
  }

  getSubscriptionUsage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/?from=1616406755000&to=1617097955000`
    );
  }
}
