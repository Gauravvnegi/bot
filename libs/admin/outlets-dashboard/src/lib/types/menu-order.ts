import { EntitySubType } from '@hospitality-bot/admin/shared';

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

export enum OrderTypes {
  DINE_IN = 'DINE_IN',
  DELIVERY = 'DELIVERY',
  TAKE_AWAY = 'TAKE_AWAY',
  KIOSK = 'KIOSK',
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

export class OrderSummaryData {
  outletType: EntitySubType;
  order: {
    id?: string;
    orderType?: OrderTypes;
    items: {
      itemId: string;
      unit: number;
      amount: number;
    }[];
  };
  offerId: string;
}

export type OrderSummaryResponse = {
  name: string;
  from: number;
  to: number;
  location: string;
  pricingDetails: {
    paxChildBelowFive: number;
    paxChildAboveFive: number;
    paxChild: number;
    paxAdult: number;
    paxDoubleOccupancy: number;
    paxTripleOccupancy: number;
    totalAmount: number;
    totalPaidAmount: number;
    totalDueAmount: number;
    taxAndFees: number;
    taxAndFeesPerDay: number;
    basePrice: number;
    discountedAmount: number;
    containerCharge: number;
    allowance: number;
  };
};
