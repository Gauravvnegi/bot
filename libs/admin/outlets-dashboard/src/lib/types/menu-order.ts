export type MenuItemCard = {
  id: string;
  itemName: string;
  mealPreference: MealPreferences;
  price: number;
  image: string;
  selected?: boolean;
};

export enum MealPreferences {
  ALL = 'ALL',
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
}

export const mealPreferenceConfig: Record<
  MealPreferences,
  {
    title: string;
    image?: string;
    filterPreference?: (item: MenuItemCard) => boolean;
  }
> = {
  ALL: {
    title: 'All',
    filterPreference: () => true,
  },
  [MealPreferences.VEG]: {
    title: 'Veg',
    image: 'assets/svg/veg.svg',
    filterPreference: (item) => item.mealPreference === MealPreferences.VEG,
  },
  [MealPreferences.NON_VEG]: {
    title: 'Non-veg',
    image: 'assets/svg/non-veg.svg',
    filterPreference: (item) => item.mealPreference === MealPreferences.NON_VEG,
  },
  // Add more preferences with their corresponding display and filter conditions
};
