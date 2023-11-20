import { ModuleNames, ProductNames, routes } from 'libs/admin/shared/src/index';
import { get, set } from 'lodash';
import { Products, SubProducts } from './subscription-plan-config.model';
import { RouteConfigPathService } from '../services/routes-config.service';
import { Router } from '@angular/router';

export class SubMenuItem {
  path: string;
  title: string;
  name: ModuleNames;
  iconUrl: string;
  isSubscribed: boolean;
  isView: boolean;
  children: SubMenuItem[];

  deserialize(input: SubProducts, prevRoute: string) {
    const routeService = new RouteConfigPathService();

    this.children = new Array<SubMenuItem>();

    this.title = input.label;
    this.name = input.name;
    this.iconUrl = input.icon;
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;

    this.path = prevRoute + '/' + routeService.getRouteFromName(input.name);

    input.config?.forEach((subMenu) => {
      if (subMenu.name) {
        this.children.push(new SubMenuItem().deserialize(subMenu, this.path));
      }
    });

    return this;
  }
}

export class ProductItem {
  path: string;
  title: string;
  description: string;
  name: ProductNames;
  iconUrl: string;
  isSubscribed: boolean;
  isView: boolean;
  children: SubMenuItem[];

  deserialize(input: Products) {
    const routeService = new RouteConfigPathService();

    this.children = new Array<SubMenuItem>();

    this.name = input.name;
    this.title = input.label;
    this.description = input?.description;
    this.iconUrl = input.icon;
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;
    this.path = '/' + routeService.getRouteFromName(input.name);
    input.config?.forEach((subMenu) => {
      if (subMenu.name) {
        this.children.push(new SubMenuItem().deserialize(subMenu, this.path));
      }
    });

    return this;
  }
}

export class Product {
  productItems: ProductItem[];

  deserialize(input: any) {
    this.productItems = new Array<ProductItem>();

    input.forEach((menu) => {
      if (menu.name)
        this.productItems.push(new ProductItem().deserialize(menu));
    });

    return this;
  }
}
