import { ModuleNames, ProductNames } from '../constants';

export interface SubscriptionConfig<
  T extends ModuleNames | ProductNames = ProductNames
> {
  config: SubscriptionConfig<ModuleNames>[];
  name: T;
  label: string;
  description: string;
  icon: string;
  isSubscribed: boolean;
  isView: boolean;
}
