import { Injectable } from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { customModule } from '../constants/layout';
import {
  ProductSubscription,
  SettingsMenuItem,
  Subscriptions,
} from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private productSubscription: ProductSubscription;
  settings: SettingsMenuItem[];

  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/subscriptions/`).pipe(
      map((res) => {
        const guest = res.products.find(
          (item) => item.name === ModuleNames.GUESTS
        );
        if (guest) {
          guest['name'] = ModuleNames.MEMBERS;
          guest['label'] = 'Members';
          guest['config'][0]['name'] = ModuleNames.GUESTS;
          guest['config'][0]['label'] = 'Guest';
          guest['config'] = [...guest['config'], ...customModule.guests.config];
        }
        res.products = [
          ...res.products,
          customModule.finance,
          customModule.channelManager,
        ];
        return res;
      })
    );
  }

  initSubscriptionDetails(data) {
    this.setSubscription(data);
    this.setSettings(data);
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
      `/api/v1/entity/${hotelId}/subscriptions/usage/${config.queryObj}`
    );
  }

  getSubscriptionUsagePercentage(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${hotelId}/subscriptions/usage/percentage${config.queryObj}`
    );
  }

  getChannelSubscription() {
    return this.subscriptions.channels;
  }

  checkModuleSubscription(productName: ModuleNames) {
    return this.productSubscription.subscribedModules.indexOf(productName) > -1;
  }

  setSettings(input) {
    const settingModule =
      input.products.find((item) => item.name === ModuleNames.SETTINGS) ?? [];

    this.settings =
      settingModule?.config?.map((item) =>
        new SettingsMenuItem().deserialize(item)
      ) ?? [];

    return this;
  }
}
