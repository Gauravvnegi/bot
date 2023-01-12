import {
  CardNames,
  ModuleConfig,
  ModuleNames,
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
  features: Features;
  products: Products[];
  active: boolean;
  planUpgradable: boolean;

  deserialize(input: any) {
    this.products = new Array<Products>();

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
    this.features = new Features().deserialize(input.features);

    input.products?.forEach((product) => {
      this.products.push(new Products().deserialize(product));
    });

    return this;
  }
}

export class Products {
  name: string;
  label: string;
  description: string;
  icon: string;
  config: SubProducts[];
  isActive: true;
  isView: true;

  deserialize(input: any) {
    this.config = new Array<SubProducts>();

    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'icon', get(input, ['icon'])),
      set({}, 'isActive', get(input, ['isActive'])),
      set({}, 'isView', get(input, ['isView']))
    );
    input.config?.forEach((subProduct) => {
      this.config.push(new SubProducts().deserialize(subProduct));
    });

    return this;
  }
}

export class SubProducts {
  name: string;
  label: string;
  description: string;
  icon: string;
  usageLimit: number;
  currentUsage: number;
  isActive: true;
  isView: true;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'icon', get(input, ['icon'])),
      set({}, 'usageLimit', get(input, ['usageLimit'])),
      set({}, 'currentUsage', get(input, ['currentUsage'])),
      set({}, 'isActive', get(input, ['isActive'])),
      set({}, 'isView', get(input, ['isView']))
    );

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
  isActive: boolean;
  isView: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'currentUsage', get(input, ['currentUsage'])),
      set({}, 'isActive', get(input, ['isActive'])),
      set({}, 'isActive', get(input, ['isActive']))
    );
    this.cost = new Cost().deserialize(input.cost);
    return this;
  }
}

export class Features {
  CHANNELS: Feature[];
  COMMUNICATION: Feature[];
  ESSENTIALS: Feature[];
  INTEGRATION: Feature[];

  deserialize(input: any) {
    this.ESSENTIALS = new Array<Feature>();
    this.INTEGRATION = new Array<Feature>();
    this.CHANNELS = new Array<Feature>();
    this.COMMUNICATION = new Array<Feature>();

    input.ESSENTIALS?.forEach((essential) => {
      this.ESSENTIALS.push(new Feature().deserialize(essential));
    });
    input.INTEGRATION?.forEach((integration) => {
      this.INTEGRATION.push(new Feature().deserialize(integration));
    });
    input.CHANNELS?.forEach((channel) => {
      this.CHANNELS.push(new Feature().deserialize(channel));
    });
    input.COMMUNICATION?.forEach((communication) => {
      this.COMMUNICATION.push(new Feature().deserialize(communication));
    });
    return this;
  }
}

export class ProductSubscription {
  subscribedModules: ModuleNames[];
  modules: Partial<Modules>;

  deserialize(input: any) {
    this.subscribedModules = new Array<ModuleNames>();
    this.modules = new Object();

    input.products?.forEach((product) => {
      this.setConfig(product);
      product.config?.forEach((subProduct) => {
        this.setConfig(subProduct);
      });
    });

    return this;
  }

  setConfig(product: Product) {
    if (product.isActive) this.subscribedModules.push(product.name);

    const productName: ModuleNames = product.name;
    let moduleProduct = ModuleConfig[productName];
    if (moduleProduct) {
      const tempCards: Partial<Cards> = new Object();
      moduleProduct.cards.forEach((card: CardNames) => {
        tempCards[card] = {
          isActive: product.isActive,
          isView: product.isView,
        };
      });

      const tempTables: Partial<Tables> = new Object();
      moduleProduct.tables.forEach((table: TableNames) => {
        tempTables[table] = {
          isActive: product.isActive,
          isView: product.isView,
          tabFilters:
            ModuleConfig[ModuleNames[product.name]]?.filters[table].tabFilters,
        };
      });

      this.modules[productName] = {
        isView: product.isView,
        isActive: product.isActive,
        cards: tempCards,
        tables: tempTables,
      };
    }
  }
}
