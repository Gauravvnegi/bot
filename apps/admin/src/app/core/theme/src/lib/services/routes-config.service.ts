import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNames, ProductNames } from '@hospitality-bot/admin/shared';
import { NavRouteOption } from 'libs/admin/shared/src/index';
import { BehaviorSubject } from 'rxjs';

/**
 * Example of a PathConfig object:
 * @example
 * const pathConfig = {
 *   shortPath: 'create-wth-dashboard',
 *   fullPath: 'create-with/create-with-home/create-wth-dashboard',
 *   name: 'CREATE_WITH_DASHBOARD',
 *   label: 'Dashboard'
 * };
 */
const pathConfig: PathConfig = {
  shortPath: '',
  fullPath: '',
  // name: '',
  label: '',
};

@Injectable({ providedIn: 'root' })
export class RoutesConfigService {
  constructor(private router: Router) {}

  readonly routesConfig = routesConfig;
  readonly reverseRouteConfig = Object.keys(routesConfig).reduce(
    (reversed, key) => {
      reversed[routesConfig[key]] = key;
      return reversed;
    },
    {}
  );

  /**
   * If same subModule in multiple product then first subscribed route respective to sub module name will be attached
   */
  modulePathConfig: ModulePathConfig = {};
  /**
   * Contains record of hierarchical route
   */
  hierarchicalPathConfig: HierarchicalPathConfig = {};

  moduleOfSubModuleWithRespectToProduct: ModuleOfSubModuleWithRespectToProduct = {};

  private $activeRoute = new BehaviorSubject<ActiveRouteConfig>({
    product: { ...pathConfig },
    module: { ...pathConfig },
    submodule: { ...pathConfig },
  });

  private $navRoutes = new BehaviorSubject<NavRouteOption[]>([]);

  navigate(config: Partial<NavigateConfig> = {}) {
    const {
      subModuleName,
      additionalPath,
      queryParams,
      isRespectiveToProduct,
    }: NavigateConfig = {
      ...defaultNavigateConfig,
      subModuleName: this.subModuleName,
      ...config,
    };

    let path = this.modulePathConfig[subModuleName];

    let moduleName = config.moduleName; // Directly from params
    // If is respective to product then find module
    if (isRespectiveToProduct && this.productName && !moduleName) {
      moduleName = this.moduleOfSubModuleWithRespectToProduct[
        this.productName
      ]?.[subModuleName];
    }

    /**
     * If module name then route will open respective to product
     */
    if (moduleName) {
      const newPath = this.hierarchicalPathConfig[this.productName]?.[
        moduleName
      ]?.[subModuleName];

      if (newPath) {
        path = newPath;
      }
    }

    if (path) {
      this.router.navigate(
        [`${path}${additionalPath ? `/${additionalPath}` : ''}`],
        { queryParams: queryParams }
      );
    } else {
      console.error(
        'CANNOT NAVIGATE: Error in finding th path',
        config,
        subModuleName
      );
    }
  }

  initActiveRoute(config: ActiveRouteConfig) {
    this.$activeRoute.next({ ...config });

    const navRoutes = new Array<NavRouteOption>();
    for (let item in config) {
      const currentConfig: PathConfig = config[item];
      const navRoute: NavRouteOption = {
        label: currentConfig.label,
        link: currentConfig.fullPath,
        isDisabled: item !== 'submodule',
      };

      navRoutes.push(navRoute);
    }

    this.$navRoutes.next(navRoutes);
  }

  initModulePathConfig(
    res: ModulePathConfig,
    hRes: HierarchicalPathConfig,
    psmRes: ModuleOfSubModuleWithRespectToProduct
  ) {
    this.modulePathConfig = res;
    this.hierarchicalPathConfig = hRes;
    this.moduleOfSubModuleWithRespectToProduct = psmRes;
  }

  get activeRouteConfigSubscription() {
    return this.$activeRoute;
  }

  get navRoutesChanges() {
    return this.$navRoutes;
  }

  /**
   * Convert module/product name to route (underScore to dash)
   * Also checks if module name is attached with route
   * @param name Module or product name
   * @returns route
   */
  getRouteFromName(name: ModuleNames | ProductNames) {
    const route = this.routesConfig[name];
    if (route) return route;

    return name.toLowerCase().split('_').join('-');
  }

  getNameFromRoute(route: string) {
    const name = this.reverseRouteConfig[route];
    if (name) return name;

    return name.toUpperCase().split('-').join('_');
  }

  get activeRouteConfig() {
    return this.$activeRoute.value;
  }

  get productName() {
    return this.activeRouteConfig.product.name;
  }

  get moduleName() {
    return this.activeRouteConfig.module.name;
  }

  get subModuleName() {
    return this.activeRouteConfig.submodule.name;
  }
}

export type PathConfig = {
  shortPath: string;
  fullPath: string;
  name?: ModuleNames | ProductNames;
  label?: string;
};

export type ActiveRouteConfig = {
  product: PathConfig;
  module: PathConfig;
  submodule: PathConfig;
};

export type ModulePathConfig = Partial<Record<ModuleNames, string>>;
export type HierarchicalPathConfig = Partial<
  Record<
    ProductNames,
    Partial<Record<ModuleNames, Partial<Record<ModuleNames, string>>>>
  >
>;

export type NavigateConfig = {
  subModuleName?: ModuleNames;
  moduleName?: ModuleNames;
  additionalPath: string;
  queryParams: any;
  isRespectiveToProduct: boolean;
};

export type ModuleOfSubModuleWithRespectToProduct = Partial<
  Record<ProductNames, Partial<Record<ModuleNames, ModuleNames>>>
>;

const defaultNavigateConfig: NavigateConfig = {
  additionalPath: '',
  queryParams: {},
  isRespectiveToProduct: false,
};

// Need to fix... Module Names cannot be read here (Circular dependency)
const routesConfig = {
  ADD_RESERVATION: 'manage-reservation',
};
