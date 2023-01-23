import {
  CardNames,
  ModuleNames,
  TableNames,
} from '../../../../../../../../../libs/admin/shared/src/index';

export type ModuleConfig = {
  name: ModuleNames;
  label: string;
  description: string;
  icon: string;
  isSubscribed: boolean;
  isView: boolean;
};

export type Product = ModuleConfig & {
  config: ModuleConfig;
};

export type Cards = Record<
  CardNames,
  { isSubscribed: boolean; isView: boolean }
>;

export type Tables = Record<
  TableNames,
  { isSubscribed: boolean; isView: boolean; tabFilters: TableNames[] }
>;

export type Modules = Record<
  ModuleNames,
  {
    isSubscribed: boolean;
    isView: boolean;
    cards: Partial<Cards>;
    tables: Partial<Tables>;
  }
>;
