import { Injectable } from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ProductSubscription,
  SettingsMenuItem,
  Subscriptions,
} from '../data-models/subscription-plan-config.model';
import { productMenuSubs } from '../data-models/product-subs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private productSubscription: ProductSubscription;
  settings: SettingsMenuItem[];
  selectedProduct: ModuleNames;

  getSubscriptionPlan(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/subscriptions/`).pipe(
      map((response) => {
        // response.products = productMenuSubs;
        return response;
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

  getSubscriptionUsage(entityId: string, config: any): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/subscriptions/usage${config.queryObj}`
    );
  }

  getModuleProductMapping() {
    return this.productSubscription.moduleProductMapping;
  }

  getSelectedProduct() {
    if (this.selectedProduct) {
      return this.subscriptions.products.find(
        (item) => item.name === this.selectedProduct
      ).config;
    }

    return this.subscriptions.products.find(
      (item) => item.isView && item.isSubscribed
    ).config;
  }

  getSubscriptionUsagePercentage(entityId: string, config): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/subscriptions/usage/percentage${config.queryObj}`
    );
  }

  getChannelSubscription() {
    return this.subscriptions.channels;
  }

  checkModuleSubscription(moduleName: ModuleNames) {
    return this.productSubscription.subscribedModules.indexOf(moduleName) > -1;
  }

  checkModuleSubscriptionBasedOnProduct(productName, moduleName) {
    return (
      this.productSubscription.subscribedModuleProductBased[
        productName
      ]?.indexOf(moduleName) === -1
    );
  }

  setSettings(input) {
    const settingModule =
      input.products.find((item) => item?.name === ModuleNames?.SETTINGS) ?? [];

    this.settings =
      settingModule?.config?.map((item) =>
        new SettingsMenuItem().deserialize(item)
      ) ?? [];

    return this;
  }

  hasComplaintManagementSystem() {
    const requestManagementSystems = ['FCS'];
    return requestManagementSystems.reduce((prev, curr) => {
      return prev || this.productSubscription.subscribedIntegrations.has(curr);
    }, false);
  }
}
