// Enum for the main object keys
export enum CalendarJourneyType {
  PRECHECKIN = 'PRECHECKIN',
  CHECKOUT = 'CHECKOUT',
  LATECHECKOUT = 'LATECHECKOUT',
  COVID = 'COVID',
  EARLYCHECKOUT = 'EARLYCHECKOUT',
  EARLYCHECKIN = 'EARLYCHECKIN',
  CHECKIN = 'CHECKIN',
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
