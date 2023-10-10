import { Route, Routes } from '@angular/router';
import { ModuleNames, SubscriptionConfig } from 'libs/admin/shared/src/index';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { moduleConfig } from '../pages/config/config.module';
import {
  ModulePathConfig,
  RoutesConfigService,
  SubscriptionPlanService,
} from '../theme/src';

type ModulePromise<T extends any> = () => Promise<T>;

const UnsubscribedModule = () =>
  import('@hospitality-bot/admin/unsubscribed').then(
    (m) => m.AdminUnsubscribedModule
  );

const getRedirectRouteConfig = (
  path: string,
  firstSubscribedChildrenPath: string,
  isSubscribed: boolean
) => {
  const moduleRouteConfig: Route = {
    path: path,
    redirectTo: isSubscribed ? firstSubscribedChildrenPath : undefined,
    loadChildren: isSubscribed ? undefined : UnsubscribedModule,
    component: firstSubscribedChildrenPath ? undefined : ComingSoonComponent,
    pathMatch: 'full',
  };

  return moduleRouteConfig;
};

export const routeFactoryNew = (
  routes: Routes,
  deps: [SubscriptionPlanService, RoutesConfigService],
  config = {}
): Routes => {
  let [subscriptionService, routesConfigService] = deps;

  const subscription = subscriptionService.getSubscription();

  const product: SubscriptionConfig[] = subscription.products;
  let modulePathConfig: ModulePathConfig = {};

  let initialRedirectPath = undefined;

  /**
   * Product Config Iteration
   */
  product.forEach((product) => {
    const productName = product.name;
    const isProductSubscribed = product.isSubscribed;
    const isProductInView = product.isView;

    if (productName && isProductInView) {
      const productRoute = routesConfigService.getRouteFromName(productName);

      let firstSubscribedModulePath = undefined;

      /**
       * Module Config Iteration
       */
      product.config.forEach((module) => {
        const moduleName = module.name;

        const isSettingModule = moduleName === ModuleNames.SETTINGS;
        // Is Setting Module - Does not necessarily required isView
        // If setting module, is View can be ignore for routing manufacturing
        const isModuleInView = module.isView || isSettingModule;
        const isModuleSubscribed = module.isSubscribed;

        if (moduleName && isModuleInView) {
          const moduleRoute = routesConfigService.getRouteFromName(module.name);
          const modulePath = `${productRoute}/${moduleRoute}`;
          let firstSubscribedSubModulePath = undefined;

          // Getting first subscribed module path (Creating circular loop)
          // if (!firstSubscribedModulePath && isModuleSubscribed) {
          //   firstSubscribedModulePath = modulePath;
          // }

          /**
           * Sub Module Config Iteration
           */
          module.config.forEach((subModule) => {
            const subModuleName = subModule.name;
            const isSubModuleSubscribed = subModule.isSubscribed;
            const isSubModuleInView = subModule.isView || isSettingModule;

            if (subModuleName && isSubModuleInView) {
              const subModuleRoute = routesConfigService.getRouteFromName(
                subModule.name
              );
              const subModulePath = `${productRoute}/${moduleRoute}/${subModuleRoute}`;

              // Getting first subscribed sub module path
              if (!firstSubscribedSubModulePath && isSubModuleSubscribed) {
                firstSubscribedSubModulePath = subModulePath;
              }

              if (
                // redirect to redirect wont work (creates loop to self route) that why full route even for product
                !firstSubscribedModulePath &&
                isModuleSubscribed &&
                isSubModuleSubscribed
              ) {
                firstSubscribedModulePath = subModulePath;
              }

              /**
               * Initial redirect path
               */
              if (
                !initialRedirectPath &&
                isProductSubscribed &&
                isModuleSubscribed &&
                isSubModuleSubscribed &&
                !isSettingModule
              ) {
                initialRedirectPath = subModulePath;
              }

              const LoadSubModule = moduleConfig[subModuleName]; // Module Load

              const subModuleRouteConfig: Route = {
                path: subModulePath,
                loadChildren: isSubModuleSubscribed
                  ? LoadSubModule
                  : UnsubscribedModule,
                component: LoadSubModule ? undefined : ComingSoonComponent,
              };

              // Pushing sub module path config
              if (isSubModuleSubscribed && !modulePathConfig[subModuleName]) {
                modulePathConfig = {
                  ...modulePathConfig,
                  [subModuleName]: `/${subModulePath}`,
                };
              }

              routes[0].children.push(subModuleRouteConfig);
            }
          });

          if (isModuleSubscribed) {
            modulePathConfig = {
              ...modulePathConfig,
              [moduleName]: `/${modulePath}`,
            };
          }

          routes[0].children.push(
            getRedirectRouteConfig(
              modulePath,
              firstSubscribedSubModulePath,
              isModuleSubscribed
            )
          );
        }
      });

      if (isProductSubscribed) {
        modulePathConfig = {
          ...modulePathConfig,
          [productName]: `/${productRoute}`,
        };
      }

      routes[0].children.unshift(
        getRedirectRouteConfig(
          productRoute,
          firstSubscribedModulePath,
          isProductSubscribed
        )
      );

      /**
       * Create Record of routes for subscribed submodules
       */
      routesConfigService.initModulePathConfig(modulePathConfig);
    }
  });

  routes[0].children.unshift({
    path: '',
    redirectTo: initialRedirectPath,
    pathMatch: 'full',
  });

  return routes;
};
