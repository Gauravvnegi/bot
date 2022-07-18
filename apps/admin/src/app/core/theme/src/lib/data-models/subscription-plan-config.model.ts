import { get, set } from 'lodash';
import {
  ModuleNames,
  ModuleConfig,
  Integrations,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

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
  cost: Cost;
  startDate: number;
  endDate: number;
  features: Features;
  active: boolean;
  planUpgradable: boolean;

  deserialize(input: any) {
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
    this.cost = new Cost().deserialize(input.cost);
    this.features = new Features().deserialize(input.features);
    return this;
  }
}

export class Cost {
  created: number;
  updated: number;
  id: string;
  type: string;
  cost: number;
  currency: string;
  usageLimit: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'created', get(input, ['created'])),
      set({}, 'updated', get(input, ['updated'])),
      set({}, 'currency', get(input, ['currency'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'cost', get(input, ['cost'])),
      set({}, 'usageLimit', get(input, ['usageLimit']))
    );
    return this;
  }
}

export class Feature {
  id: string;
  name: string;
  label: string;
  description: string;
  type: string;
  cost: Cost;
  currentUsage: number;
  active: boolean;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'name', get(input, ['name'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'currentUsage', get(input, ['currentUsage'])),
      set({}, 'active', get(input, ['active']))
    );
    this.cost = new Cost().deserialize(input.cost);
    return this;
  }
}

export class Features {
  MODULE: Feature[];
  ESSENTIALS: Feature[];
  INTEGRATION: Feature[];
  CHANNELS: Feature[];
  COMMUNICATION: Feature[];

  deserialize(input: any) {
    this.MODULE = new Array<Feature>();
    this.ESSENTIALS = new Array<Feature>();
    this.INTEGRATION = new Array<Feature>();
    this.CHANNELS = new Array<Feature>();
    this.COMMUNICATION = new Array<Feature>();

    input.MODULE?.forEach((module) => {
      this.MODULE.push(new Feature().deserialize(module));
    });
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

export class ModuleSubscription {
  features: any;
  modules: any;
  integrations: any;

  deserialize(input: any) {
    this.modules = new Object();
    this.integrations = new Object();
    this.features = get(input, ['features']);
    input.features?.MODULE?.forEach((module) => {
      if (!this.modules[ModuleNames[module.name]] && ModuleNames[module.name]) {
        const tempCards = new Object();
        ModuleConfig[ModuleNames[module.name]].cards.forEach((card) => {
          tempCards[card] = { active: module.active };
        });
        const tempTables = new Object();
        ModuleConfig[ModuleNames[module.name]].tables.forEach((table) => {
          tempTables[table] = {
            active: module.active,
            tabFilters:
              ModuleConfig[ModuleNames[module.name]]?.filters[table].tabFilters,
          };
        });
        this.modules[ModuleNames[module.name]] = {
          active: module.active,
          cards: tempCards,
          tables: tempTables,
        };
      }
    });
    input.features?.INTEGRATION?.forEach((data) => {
      if (
        !this.integrations[Integrations[data.name]] &&
        Integrations[data.name]
      ) {
        this.integrations[Integrations[data.name]] = { active: data.active };
      }
    });
    return this;
  }
}
