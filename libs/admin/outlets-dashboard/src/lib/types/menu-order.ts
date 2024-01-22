export type MenuItemCard = {
  id: string;
  itemName: string;
  mealPreference: MealPreferences;
  price: number;
  itemInstruction?: string;
  unit?: number;
  image?: string;
};

export enum MealPreferences {
  ALL = 'ALL',
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
}

export type ItemsFormFields = 'Instruction' | 'Offer' | 'ItemInstruction';

export const mealPreferenceConfig: Record<
  MealPreferences,
  {
    title: string;
    image?: string;
    filterPreference?: (mealPreference?: MealPreferences) => boolean;
  }
> = {
  [MealPreferences.ALL]: {
    title: 'All',
    filterPreference: (item) => true,
  },
  [MealPreferences.VEG]: {
    title: 'Veg',
    image: 'assets/svg/veg.svg',
    filterPreference: (item) => item === MealPreferences.VEG,
  },
  [MealPreferences.NON_VEG]: {
    title: 'Non-veg',
    image: 'assets/svg/non-veg.svg',
    filterPreference: (item) => item === MealPreferences.NON_VEG,
  },
  // Add more preferences with their corresponding display and filter conditions
};
