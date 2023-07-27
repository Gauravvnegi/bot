export type OutletConfig = {
  type: ConfigTypes[];
};

export type ConfigTypes = {
  label: string;
  subtype: string[];
  menu?: MenuConfig;
  value: string;
};

export type MenuConfig = {
  type: string[];
  mealPreference: string[];
  category: string[];
};
