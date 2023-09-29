import { ModuleNames, routes } from 'libs/admin/shared/src/index';
import { get, set } from 'lodash';

export class SubMenuItem {
  path: string;
  title: string;
  name: ModuleNames;
  url: string;
  isSubscribed: boolean;
  isView: boolean;
  children: SubMenuItem[];

  deserialize(input: any) {
    this.children = new Array<SubMenuItem>();

    Object.assign(
      this,
      set({}, 'title', get(input, ['label'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'url', get(input, ['icon']))
    );
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;

    this.path = routes[input.name];

    input.config?.forEach((subMenu) => {
      if (routes[subMenu.name] && subMenu.isView) {
        this.children.push(new SubMenuItem().deserialize(subMenu));
      }
    });

    return this;
  }
}

export class MenuItem {
  path: string;
  title: string;
  name: ModuleNames;
  isSubscribed: boolean;
  isView: boolean;

  children: SubMenuItem[];
  url: string;

  deserialize(
    input: any,
    configuration?: {
      moduleList: any;
      moduleData: any;
    }
  ) {
    this.children = new Array<SubMenuItem>();

    Object.assign(
      this,
      set({}, 'title', get(input, ['label'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'url', get(input, ['icon']))
    );
    this.isSubscribed = input.isSubscribed;
    this.isView = input.isView;

    this.path = routes[input.name];

    input.config?.forEach((subMenu) => {
      if (routes[subMenu.name] && subMenu.isView) {
        this.children.push(new SubMenuItem().deserialize(subMenu));
      }
    });

    return this;
  }
}

export class Menu {
  menuItems: MenuItem[];

  deserialize(input: any) {
    this.menuItems = new Array<MenuItem>();

    input.forEach((menu) => {
      if (routes[menu.name] && menu.isView)
        this.menuItems.push(new MenuItem().deserialize(menu));
    });

    return this;
  }
}
