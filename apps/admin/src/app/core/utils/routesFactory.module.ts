import { Route, Routes } from '@angular/router';
import { ModuleNames, SubscriptionConfig } from 'libs/admin/shared/src/index';
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import {
  moduleConfig,
  productConfig,
  subModuleConfig,
} from '../pages/config/config.module';
import {
  HierarchicalPathConfig,
  ModuleOfSubModuleWithRespectToProduct,
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
  let hierarchicalPathConfig: HierarchicalPathConfig = {};
  let moduleOfSubModuleWithRespectToProduct: ModuleOfSubModuleWithRespectToProduct = {};

  let initialRedirectPath = undefined;

  // View not in use to create route ,
  // use module declaration if not in view and loadModule is also not present the don't make route
  const makeRouteEvenIfIsViewIsFalse = true;

  /**
   * Product Config Iteration
   */
  product.forEach((product) => {
    const productName = product.name;
    const isProductSubscribed = product.isSubscribed;
    const isProductInView = product.isView || makeRouteEvenIfIsViewIsFalse;

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
        const isModuleInView =
          module.isView || isSettingModule || makeRouteEvenIfIsViewIsFalse;
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

            const isSubModuleInView =
              subModule.isView ||
              isSettingModule ||
              makeRouteEvenIfIsViewIsFalse;

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

              if (
                isProductSubscribed &&
                isModuleSubscribed &&
                isSubModuleSubscribed
              ) {
                hierarchicalPathConfig = {
                  ...hierarchicalPathConfig,
                  [productName]: {
                    ...(hierarchicalPathConfig[productName] ?? {}),
                    [moduleName]: {
                      ...(hierarchicalPathConfig[productName]?.[moduleName] ??
                        {}),
                      [subModuleName]: subModulePath,
                    },
                  },
                };
              }

              moduleOfSubModuleWithRespectToProduct = {
                ...moduleOfSubModuleWithRespectToProduct,
                [productName]: {
                  ...(moduleOfSubModuleWithRespectToProduct[productName] ?? {}),
                  [subModuleName]: moduleName,
                },
              };

              /**
               * Module Load
               * Choosing sub module config first
               * And if not present then check in module config
               * last from product config
               */
              let LoadSubModule = subModuleConfig[subModuleName];
              if (!LoadSubModule) {
                LoadSubModule = moduleConfig[moduleName];
              }
              if (!LoadSubModule) {
                LoadSubModule = productConfig[productName];
              }

              /**
               * Only view check is here
               * For the case of module not in view but has Load Module then only make the routes
               * Else only make route for those module in view
               * loadChildren will only load if subModule is subscribed all the way thru (hierarchical)
               */
              if (subModule.isView || (!subModule.isView && LoadSubModule)) {
                const subModuleRouteConfig: Route = {
                  path: subModulePath,
                  loadChildren:
                    isProductSubscribed &&
                    isModuleSubscribed &&
                    isSubModuleSubscribed
                      ? LoadSubModule
                      : UnsubscribedModule,
                  component: LoadSubModule ? undefined : ComingSoonComponent,
                };
                routes[0].children.push(subModuleRouteConfig);

                /**
                 * To Do not working
                 * Adding wild card route entry for create with home modules
                 */
                // if (moduleName === ModuleNames.CREATE_WITH_HOME) {
                //   const wildCardCreateRouteConfig: Route = {
                //     path: `${subModulePath}/**`,
                //     loadChildren:
                //       isProductSubscribed &&
                //       isModuleSubscribed &&
                //       isSubModuleSubscribed
                //         ? LoadSubModule
                //         : UnsubscribedModule,
                //     component: LoadSubModule ? undefined : ComingSoonComponent,
                //     pathMatch: 'full',
                //   };
                //   routes[0].children.push(wildCardCreateRouteConfig);
                // }
              }

              // Pushing sub module path config
              if (isSubModuleSubscribed && !modulePathConfig[subModuleName]) {
                modulePathConfig = {
                  ...modulePathConfig,
                  [subModuleName]: `/${subModulePath}`,
                };
              }
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
    }
  });

  /**
   * Create Record of routes for subscribed submodules
   */
  routesConfigService.initModulePathConfig(
    modulePathConfig,
    hierarchicalPathConfig,
    moduleOfSubModuleWithRespectToProduct
  );

  routes[0].children.unshift({
    path: '',
    redirectTo: initialRedirectPath,
    pathMatch: 'full',
  });

  return routes;
};
