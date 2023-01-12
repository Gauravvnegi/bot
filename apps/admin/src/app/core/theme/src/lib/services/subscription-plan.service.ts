import { Injectable } from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProductSubscription,
  Subscriptions,
} from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private productSubscription: ProductSubscription;

  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscriptions/`);
  }

  initSubscriptionDetails(data) {
    this.setSubscription(data);
    this.subscription$.next(new ProductSubscription().deserialize(data));
  }

  setSubscription(data) {
    this.subscriptions = new Subscriptions().deserialize(data);
    this.productSubscription = new ProductSubscription().deserialize(data);
  }

  getSubscription(): Subscriptions {
    return this.subscriptions;
  }

  getProductSubscription(): ProductSubscription['modules'] {
    return this.productSubscription.modules;
  }

  getSubscribedModules(): ProductSubscription['subscribedModules'] {
    return this.productSubscription.subscribedModules;
  }

  getSubscriptionUsage(hotelId: string, config: any): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/${config.queryObj}`
    );
  }

  getSubscriptionUsagePercentage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/hotel/${hotelId}/subscriptions/usage/percentage${config.queryObj}`
    );
  }

  getChannelSubscription() {
    return this.subscriptions.features.CHANNELS;
  }

  checkModuleSubscription(productName: ModuleNames) {
    return this.productSubscription.subscribedModules.indexOf(productName) > -1;
  }
}
