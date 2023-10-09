import { Injectable } from '@angular/core';
import { ModuleNames, ProductNames } from '@hospitality-bot/admin/shared';

@Injectable({ providedIn: 'root' })
export class RoutesConfigService {
  readonly routesConfig = routesConfig;

  private _activeRoute: ActiveRouteConfig = {
    product: {
      shortPath: '', // create-with
      fullPath: '', // create-with
    },
    module: {
      shortPath: '', // create-with-home
      fullPath: '', // create-with/create-with-home
    },
    submodule: {
      shortPath: '', // create-wth-dashboard
      fullPath: '', // create-with/create-with-home/create-wth-dashboard
    },
  };

  initActiveRoute(config: ActiveRouteConfig) {
    this._activeRoute = {
      ...this._activeRoute,
      ...config,
    };
  }

  /**
   * Convert module/product name to route (underScore to dash)
   * Also checks if module name is attached with route
   * @param name Module or product name
   * @returns route
   */
  getRouteFromName(name: ModuleNames | ProductNames) {
    const route = routesConfig[name];
    if (route) return route;

    return name.toLowerCase().split('_').join('-');
  }

  get activeRouteConfig() {
    return this._activeRoute;
  }
}

type PathConfig = {
  shortPath: string;
  fullPath: string;
};

type ActiveRouteConfig = {
  product: PathConfig;
  module: PathConfig;
  submodule: PathConfig;
};

const routesConfig = {};
