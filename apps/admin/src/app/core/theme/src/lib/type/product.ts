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
  isActive: boolean;
  isView: boolean;
};

export type Product = ModuleConfig & {
  config: ModuleConfig;
};

export type Cards = Record<CardNames, { isActive: boolean; isView: boolean }>;

export type Tables = Record<
  TableNames,
  { isActive: boolean; isView: boolean; tabFilters: TableNames[] }
>;

export type Modules = Record<
  ModuleNames,
  {
    isActive: boolean;
    isView: boolean;
    cards: Partial<Cards>;
    tables: Partial<Tables>;
  }
>;
