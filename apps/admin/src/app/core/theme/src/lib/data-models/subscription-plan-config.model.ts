import {
  CardNames,
  ModuleConfig,
  ModuleNames,
  ProductNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { get, set } from 'lodash';
import { Cards, Modules, Product, Tables } from '../type/product';

export class SubscriptionPlan {
  featureIncludes: Item[];
  deserialize(input) {
    this.featureIncludes = new Array<Item>();
    input.featuresIncludes.forEach((data) => {
      this.featureIncludes.push(data);
    });
  }
}

export class Item {
  featureName: string;
  id: number;
  isManage: boolean;
  isView: boolean;
}

export class Subscriptions {
  id: string;
  planType: string;
  name: string;
  planId: string;
  description: string;
  startDate: number;
  endDate: number;

  channels: Feature[];
  integration: Feature[];
  essentials: Feature[];
  communication: Feature[];
  products: Products[];
  active: boolean;
  planUpgradable: boolean;

  deserialize(input: any) {
    this.products = new Array<Products>();

    this.essentials = new Array<Feature>();
    this.integration = new Array<Feature>();
    this.channels = new Array<Feature>();
    this.communication = new Array<Feature>();

    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'planType', get(input, ['planType'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'planId', get(input, ['planId'])),
      set({}, 'startDate', get(input, ['startDate'])),
      set({}, 'endDate', get(input, ['endDate'])),
      set({}, 'active', get(input, ['active'])),
      set({}, 'planUpgradable', get(input, ['planUpgradable'])),
      set({}, 'description', get(input, ['description']))
    );

    input.products?.forEach((product) => {
      this.products.push(new Products().deserialize(product));
    });

    input.essentials?.forEach((item) => {
      this.essentials.push(new Feature().deserialize(item));
    });
    input.integration?.forEach((item) => {
      this.integration.push(new Feature().deserialize(item));
    });
    input.channels?.forEach((item) => {
      this.channels.push(new Feature().deserialize(item));
    });
    input.communication?.forEach((item) => {
      this.communication.push(new Feature().deserialize(item));
    });

    return this;
  }
}

export class Products {
  name: ProductNames;
  label: string;
  description: string;
  icon: string;
  config: SubProducts[];
  isSubscribed: true;
  isView: true;

  deserialize(input: any) {
    this.config = new Array<SubProducts>();

    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'icon', get(input, ['icon'])),
      set({}, 'isSubscribed', get(input, ['isSubscribed'])),
      set({}, 'isView', get(input, ['isView']))
    );
    input.config?.forEach((subProduct) => {
      this.config?.push(new SubProducts().deserialize(subProduct));
    });

    return this;
  }
}

export class SubProducts {
  name: ModuleNames;
  label: string;
  description: string;
  icon: string;
  cost: Cost;
  currentUsage: number;
  isSubscribed: true;
  isView: true;
  config: SubProducts[];

  deserialize(input: any) {
    this.config = new Array<SubProducts>();

    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'icon', get(input, ['icon'])),
      set({}, 'currentUsage', get(input, ['currentUsage'])),
      set({}, 'isSubscribed', get(input, ['isSubscribed'])),
      set({}, 'isView', get(input, ['isView']))
    );
    if (input.config)
      input.config?.forEach((subProduct) => {
        this.config.push(new SubProducts().deserialize(subProduct));
      });

    this.cost = new Cost().deserialize(input.cost);

    return this;
  }
}

export class Cost {
  cost: number;
  usageLimit: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'cost', get(input, ['cost'])),
      set({}, 'usageLimit', get(input, ['usageLimit']))
    );
    return this;
  }
}

export class Feature {
  name: string;
  label: string;
  description: string;
  cost: Cost;
  currentUsage: number;
  isSubscribed: boolean;
  isView: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'currentUsage', get(input, ['currentUsage'])),
      set({}, 'isSubscribed', get(input, ['isSubscribed'])),
      set({}, 'isView', get(input, ['isSubscribed']))
    );
    this.cost = new Cost().deserialize(input.cost);
    return this;
  }
}

export class ProductSubscription {
  subscribedModuleProductBased: Partial<Record<ModuleNames, ModuleNames[]>>;
  subscribedProducts: ModuleNames[];
  subscribedModules: ModuleNames[];
  modules: Partial<Modules>;
  subscribedIntegrations: Set<string>;
  moduleProductMapping: Partial<Record<ModuleNames, ModuleNames>>;

  deserialize(input: any) {
    this.subscribedModules = new Array<ModuleNames>();
    this.subscribedProducts = new Array<ModuleNames>();
    this.subscribedModuleProductBased = {};
    this.moduleProductMapping = {};

    this.modules = new Object();

    input.products?.forEach((product) => {
      const productName = product.name;
      const isProductSubscribed = product.isSubscribed;

      if (isProductSubscribed) {
        this.subscribedProducts.push(productName);
        this.subscribedModuleProductBased = {
          ...this.subscribedModuleProductBased,
          [productName]: [],
        };
      }

      product.config?.forEach((module) => {
        this.setConfig(module, isProductSubscribed);
        const isModuleSubscribed = module.isSubscribed;

        if (isProductSubscribed && isModuleSubscribed) {
          this.subscribedModuleProductBased[productName].push(module.name);
        }

        // Only sub module with initial subscribed product
        if (
          isModuleSubscribed &&
          module.isView &&
          !this.moduleProductMapping[module.name]
        ) {
          this.moduleProductMapping = {
            ...this.moduleProductMapping,
            [module.name]: productName,
          };
        }

        module.config?.forEach((subModule) => {
          const isSubModuleSubscribed = subModule.isSubscribed;

          if (isProductSubscribed && isSubModuleSubscribed) {
            this.subscribedModuleProductBased[productName].push(subModule.name);
          }

          if (
            subModule.isSubscribed &&
            subModule.isView &&
            !this.moduleProductMapping[subModule.name]
          ) {
            this.moduleProductMapping = {
              ...this.moduleProductMapping,
              [subModule.name]: productName,
            };
          }
          this.setConfig(subModule, isProductSubscribed && isModuleSubscribed);
        });
      });
    });

    this.subscribedIntegrations = new Set<string>();
    input.integration.forEach((item) => {
      if (item.isSubscribed) {
        this.subscribedIntegrations.add(item.name);
      }
    });

    return this;
  }

  setConfig(module: Product, isParentSubscribed: boolean) {
    if (module.isSubscribed && isParentSubscribed)
      this.subscribedModules.push(module.name);

    const productName: ModuleNames = module.name;
    let moduleProduct = ModuleConfig[productName];
    if (moduleProduct) {
      const tempCards: Partial<Cards> = new Object();
      moduleProduct.cards.forEach((card: CardNames) => {
        tempCards[card] = {
          isSubscribed: module.isSubscribed,
          isView: module.isView,
        };
      });

      const tempTables: Partial<Tables> = new Object();
      moduleProduct.tables.forEach((table: TableNames) => {
        tempTables[table] = {
          isSubscribed: module.isSubscribed,
          isView: module.isView,
          tabFilters:
            ModuleConfig[ModuleNames[module.name]]?.filters[table].tabFilters,
        };
      });

      this.modules[productName] = {
        isView: module.isView,
        isSubscribed: module.isSubscribed,
        cards: tempCards,
        tables: tempTables,
      };
    }
  }
}

export class SettingsMenuItem {
  name: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  isDisabled: boolean;
  path: string;

  deserialize(input, route: string) {
    this.path = route;
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'title', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'icon', get(input, ['icon'])),
      set({}, 'isActive', get(input, ['isView'])),
      set({}, 'isDisabled', !get(input, ['isSubscribed']))
    );
    return this;
  }
}
