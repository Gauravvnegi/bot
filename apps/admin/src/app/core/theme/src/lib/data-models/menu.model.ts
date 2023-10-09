import { ModuleNames, ProductNames, routes } from 'libs/admin/shared/src/index';
import { get, set } from 'lodash';
import { Products, SubProducts } from './subscription-plan-config.model';
import { convertNameToRoute } from '../../../../../../../../../libs/admin/shared/src/lib/utils/valueFormatter';

export class SubMenuItem {
  path: string;
  title: string;
  name: ModuleNames;
  iconUrl: string;
  isSubscribed: boolean;
  isView: boolean;
  children: SubMenuItem[];

  deserialize(input: SubProducts, prevRoute: string) {
    this.children = new Array<SubMenuItem>();

    this.title = input.label;
    this.name = input.name;
    this.iconUrl = input.icon;
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;

    this.path = prevRoute + '/' + convertNameToRoute(input.name);

    input.config?.forEach((subMenu) => {
      if (subMenu.isView) {
        this.children.push(new SubMenuItem().deserialize(subMenu, this.path));
      }
    });

    return this;
  }
}

export class ProductItem {
  path: string;
  title: string;
  name: ProductNames;
  iconUrl: string;
  isSubscribed: boolean;
  isView: boolean;
  children: SubMenuItem[];

  deserialize(input: Products) {
    this.children = new Array<SubMenuItem>();

    this.name = input.name;
    this.title = input.label;
    this.iconUrl = input.icon;
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;
    this.path = '/' + convertNameToRoute(input.name);

    input.config?.forEach((subMenu) => {
      if (subMenu.isView) {
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
      if (menu.isView)
        this.productItems.push(new ProductItem().deserialize(menu));
    });

    return this;
  }
}
