import { Option } from '@hospitality-bot/admin/shared';

export type OutletConfig = {
  HOURS;
  WEEKDAYS;
  DIMENSIONS;
  type: ConfigTypes[];
};

export type ConfigTypes = {
  label: string;
  subtype: string[];
  menu?: MenuConfig;
  value: string;
  cuisinesTypes: string[];
};

export type MenuConfig = {
  type: string[];
  mealPreference: string[];
  category: string[];
  units: Option[];
};
