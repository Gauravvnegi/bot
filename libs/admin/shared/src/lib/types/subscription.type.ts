import { ModuleNames, ProductNames } from '../constants';

export interface SubscriptionConfig {
  config: SubscriptionConfig[];
  name: ModuleNames | ProductNames;
  label: string;
  description: string;
  icon: string;
  isSubscribed: boolean;
  isView: boolean;
}
