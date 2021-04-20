import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import {
  ModuleSubscription,
  Subscriptions,
} from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private moduleSubscriptions: ModuleSubscription;
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscriptions/`);
  }

  initSubscriptionDetails(data) {
    this.setSubscription(data);
    this.subscription$.next(new ModuleSubscription().deserialize(data));
  }

  setSubscription(data) {
    this.moduleSubscriptions = new ModuleSubscription().deserialize(data);
    this.subscriptions = new Subscriptions().deserialize(data);
  }

  getSubscription(): Subscriptions {
    return this.subscriptions;
  }

  getModuleSubscription(): ModuleSubscription {
    return this.moduleSubscriptions;
  }

  getSubscriptionUsage(hotelId: string, config: any): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/${config.queryObj}`
    );
  }
}
