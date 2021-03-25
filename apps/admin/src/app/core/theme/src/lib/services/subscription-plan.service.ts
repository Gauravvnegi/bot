import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: SubscriptionPlan;
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscription-plan`);
  }

  setSubscription(data) {
    this.subscriptions = data;
    this.subscription$.next(data);
  }

  getSubscription() {
    return this.subscriptions;
  }
}
