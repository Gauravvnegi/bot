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
import { ProductNames } from 'libs/admin/shared/src/index';
import { RouteConfigPathService } from './routes-config.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private productSubscription: ProductSubscription;
  settings: SettingsMenuItem[];
  selectedProduct: ProductNames;

  getSubscriptionPlan(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/subscriptions/`).pipe(
      map((response) => {
        // response.products = productMenuSubs;
        response.products?.forEach((element) => {
          element.config.push({
            name: 'REPORTS',
            label: 'Reports',
            isSubscribed: true,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icon/settings.png',

            isView: true,
          });

          element.config?.forEach((item) => {
            if (item.name === 'REPORTS') {
              item.config = [
                {
                  name: 'RESERVATION_REPORTS',
                  label: 'Reservation',
                  isSubscribed: true,
                  isView: true,
                },
                {
                  name: 'MANAGER_REPORTS',
                  label: 'Manager',
                  isSubscribed: true,
                  isView: true,
                },
                {
                  name: 'OCCUPANCY_REPORTS',
                  label: 'Occupancy',
                  isSubscribed: true,
                  isView: true,
                },
                {
                  name: 'REVENUE_REPORTS',
                  label: 'Revenue',
                  isSubscribed: true,
                  isView: true,
                },
                {
                  name: 'FINANCIAL_REPORTS',
                  label: 'Financial',
                  isSubscribed: true,
                  isView: true,
                },
              ];
            }
          });
        });
        return response;
      })
    );
  }

  initSubscriptionDetails(data) {
    this.setSubscription(data);
    this.subscription$.next(new ProductSubscription().deserialize(data));
  }

  setSubscription(data) {
    this.subscriptions = new Subscriptions().deserialize(data);
    this.productSubscription = new ProductSubscription().deserialize(data);
  }

  setSelectedProduct(productName: ProductNames) {
    this.selectedProduct = productName;
    this.setSettings();
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
    return this.productSubscription?.moduleProductMapping;
  }

  getSelectedProductData() {
    if (this.selectedProduct) {
      return this.subscriptions.products.find(
        (item) => item.name === this.selectedProduct
      );
    }

    return this.getFirstSubscribedProduct();
  }

  getModuleData(moduleName) {
    const productName = this.productSubscription.moduleProductMapping[
      moduleName
    ];
    return this.subscriptions.products
      .find((item) => item.name === productName)
      ?.config?.find((item) => item.name === moduleName);
  }

  private getFirstSubscribedProduct() {
    const firstSelectedProduct = this.subscriptions.products.find((item) => {
      return item.isSubscribed && item.isView && !!item.config?.length;
    });

    // setting product
    this.selectedProduct = firstSelectedProduct.name;
    this.setSettings();

    return firstSelectedProduct;
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

  checkProductSubscription(moduleName: ModuleNames) {
    //should be productNames
    return this.productSubscription.subscribedProducts.indexOf(moduleName) > -1;
  }

  checkProductOrModuleSubscription(moduleName: ModuleNames) {
    return (
      this.checkProductSubscription(moduleName) ||
      this.checkModuleSubscription(moduleName)
    );
  }

  checkModuleSubscriptionWithRespectiveToProduct(
    productName: ProductNames,
    moduleName: ModuleNames
  ) {
    return (
      this.productSubscription.subscribedModuleProductBased[
        productName
      ]?.indexOf(moduleName) !== -1
    );
  }

  setSettings() {
    const routesConfigPathService = new RouteConfigPathService();

    // parent route for settings based on product
    const route =
      '/' +
      routesConfigPathService.getRouteFromName(this.selectedProduct) +
      '/' +
      routesConfigPathService.getRouteFromName(ModuleNames.SETTINGS);

    const settingModule = this.subscriptions.products
      .find((item) => item.name === this.selectedProduct)
      ?.config.find((item) => item?.name === ModuleNames.SETTINGS);

    this.settings =
      settingModule?.config?.map((item) =>
        new SettingsMenuItem().deserialize(
          item,
          route + '/' + routesConfigPathService.getRouteFromName(item.name)
        )
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
