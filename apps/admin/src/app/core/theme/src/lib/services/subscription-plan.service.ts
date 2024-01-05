import { Injectable } from '@angular/core';
import {
  ModuleNames,
  PermissionModuleNames,
  ProductNames,
  UserResponse,
} from 'libs/admin/shared/src/index';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ProductSubscription,
  SettingsMenuItem,
  Subscriptions,
  UserSubscriptionPermission,
} from '../data-models/subscription-plan-config.model';
import { RouteConfigPathService } from './routes-config.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
  subscription$ = new BehaviorSubject({});
  private subscriptions: Subscriptions;
  private productSubscription: ProductSubscription;
  settings: SettingsMenuItem[];
  selectedProduct: ProductNames;
  comingSoonModules: ModuleNames[] = [];
  userSubscriptionPermission: UserSubscriptionPermission;

  getSubscriptionPlan(entityId: string): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}/subscriptions/`).pipe(
      map((response) => {
        // response.products = productMenuSubs;
        // response.products?.forEach((element) => {
        //   let hasReport = false;

        //   element.config?.forEach((item) => {
        //     if (item.name === 'REPORTS') {
        //       hasReport = true;
        //       item.config = reportsConfigMenu.config;
        //     }
        //   });

        //   if (!hasReport) {
        //     element.config?.push(reportsConfigMenu);
        //   }
        // });
        return response;
      })
    );
  }

  initSubscriptionDetails(data) {
    this.setSubscription(data);
    this.subscription$.next(new ProductSubscription().deserialize(data));
  }

  initUserBasedSubscription(userRes: UserResponse) {
    this.userSubscriptionPermission = new UserSubscriptionPermission().deserialize(
      userRes
    );
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

  getSelectedProductData(name?: ProductNames) {
    return this.subscriptions.products.find((item) => item.name === name);
  }

  initComingSoonModules(input: ModuleNames[]) {
    this.comingSoonModules = input;
  }

  isComingSoonModule(input: ModuleNames) {
    return this.comingSoonModules.indexOf(input) !== -1;
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

  checkProductSubscription(moduleName: ModuleNames | ProductNames) {
    return (
      this.productSubscription.subscribedProducts.indexOf(
        moduleName as ModuleNames //should be productNames
      ) > -1
    );
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

  /**
   * Only for sub modules
   */
  hasManageUserPermission(names: PermissionModuleNames) {
    return this.userSubscriptionPermission.permission[names]?.canManage;
  }

  /**
   * Only for product
   */
  hasUserPermissionForProduct(names: ProductNames) {
    return this.userSubscriptionPermission.productPermission.includes(names);
  }

  /**
   * View user permission will also have product
   */
  hasViewUserPermission<T extends PermissionType>(params: PermissionParams<T>) {
    const { type, name } = params;

    let isProductViewTrue = false;
    let isModuleViewTrue = false;

    if (type === 'product') {
      isProductViewTrue =
        this.userSubscriptionPermission.productPermission.indexOf(
          name as ProductNames
        ) !== -1;
    }

    if (type === 'module') {
      const permissionType = this.productSubscription
        .submodulePermissionMapping[name as ModuleNames];

      /**
       * if there is no permission type related to this module
       * then there is no need to check permission
       */
      if (!permissionType) {
        return true;
      }

      isModuleViewTrue = this.userSubscriptionPermission.permission[
        permissionType
      ]?.canView;
    }
    return isProductViewTrue || isModuleViewTrue;
  }

  show(): { isCalenderView: boolean } {
    const data = {
      isCalenderView:
        this.checkModuleSubscription(ModuleNames.ADD_RESERVATION) &&
        this.hasManageUserPermission(PermissionModuleNames.RESERVATION) &&
        this.checkProductSubscription(ModuleNames.PREDICTO_PMS) &&
        this.hasUserPermissionForProduct(ProductNames.PREDICTO_PMS),
    };
    return data;
  }
}

type PermissionType = 'product' | 'module';
type PermissionParams<T extends PermissionType> = {
  name: T extends 'product' ? ProductNames : ModuleNames;
  type: T;
};
