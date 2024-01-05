// Enum for the main object keys
export enum JourneyTypes {
  PRECHECKIN = 'PRECHECKIN',
  CHECKOUT = 'CHECKOUT',
  LATECHECKOUT = 'LATECHECKOUT',
  EARLYCHECKOUT = 'EARLYCHECKOUT',
  EARLYCHECKIN = 'EARLYCHECKIN',
  CHECKIN = 'CHECKIN',
  LATECHECKIN = 'LATECHECKIN',
}

// Type for the journey details
export type CalendarJourneyResponse = {
  id: string;
  name: string;
  title: string;
  enabled: boolean;
  journeyStartTime: string;
  journeyEndTime: string;
  defaultJourneyStartTime: number;
  defaultJourneyEndTime: number;
  onlinePayment: boolean;
  payAtDesk: boolean;
  templateId: string;
  hotelId: string | null;
  imageUrl: string;
  sortSequence: number;
  payableAmount: number;
  payableAmountUnit: string;
  journeyStartDays: number;
  journeyEndDays: number;
};

type JourneyTypeKeys = keyof Pick<
  typeof JourneyTypes,
  'LATECHECKOUT' | 'EARLYCHECKIN' | 'CHECKIN' | 'CHECKOUT'
>;

export const JourneyTypeConfig: Record<
  JourneyTypeKeys,
  { title: string; descriptions: string[] }
> = {
  [JourneyTypes.LATECHECKOUT]: {
    title: 'Late Check-Out',
    descriptions: [
      'You are doing Checkout after the actual departure time,',
      'do you want to charge late checkout charges',
    ],
  },
  [JourneyTypes.EARLYCHECKIN]: {
    title: 'Early Check-In',
    descriptions: [
      'You are doing Checkin before the actual arrival time,',
      'do you want to charge early checkin charges?',
    ],
  },
  [JourneyTypes.CHECKIN]: {
    title: 'Manual Check-In',
    descriptions: [
      'Guest is about to checkin',
      'Are you sure you want to continue?',
    ],
  },
  [JourneyTypes.CHECKOUT]: {
    title: 'Manual Check-Out',
    descriptions: [
      'Guest is about to checkout',
      'Are you sure you want to continue?',
    ],
  },
};

export const JourneyTypeRequests: Record<
  JourneyTypes,
  { title: string; descriptions: string[]; args: string[] }
> = {
  [JourneyTypes.PRECHECKIN]: {
    title: 'Pre Check-In Request',
    descriptions: ['Guest pre-checkin request description here.'],
    args: ['CHECKIN', 'ACCEPT'],
  },
  [JourneyTypes.EARLYCHECKIN]: {
    title: 'Early Check-In Request',
    descriptions: ['Guest checkin request is before scheduled arrival time.'],
    args: ['CHECKIN', 'ACCEPT'],
  },
  [JourneyTypes.CHECKIN]: {
    title: 'Check-In Request',
    descriptions: ['Guest is about to checkin.'],
    args: ['CHECKIN', 'ACCEPT'],
  },
  [JourneyTypes.LATECHECKIN]: {
    title: 'Late Check-In Request',
    descriptions: ['Guest checkin request is before scheduled arrival time.'],
    args: ['CHECKIN', 'ACCEPT'],
  },
  [JourneyTypes.EARLYCHECKOUT]: {
    title: 'Early Check-Out Request',
    descriptions: [
      'Guest checkout request is before scheduled departure time.',
    ],
    args: ['CHECKOUT', 'ACCEPT'],
  },
  [JourneyTypes.CHECKOUT]: {
    title: 'Check-Out Request',
    descriptions: ['Guest is about to checkout.'],
    args: ['CHECKOUT', 'ACCEPT'],
  },
  [JourneyTypes.LATECHECKOUT]: {
    title: 'Late Check-Out Request',
    descriptions: ['Guest checkout request is after checkout request window.'],
    args: ['CHECKOUT', 'ACCEPT'],
  },
};
