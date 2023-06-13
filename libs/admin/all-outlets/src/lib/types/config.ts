export type OutletConfig = {
  type: ConfigTypes[];
};

export type ConfigTypes = {
  name: string;
  subtype: string[];
  menu?: MenuConfig;
  value: string;
};

export type MenuConfig = {
  type: string[];
  mealPreference: string[];
  category: string[];
};
