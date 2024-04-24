import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { SessionType } from 'libs/admin/manage-reservation/src/lib/constants/form';

interface Offer {
  id: string;
  created: number;
  updated: number;
  offerType: string;
}

interface PricingDetails {
  basePrice: number;
  discountedAmount: number;
  paxChildAboveFive: number;
  paxChildBelowFive: number;
  paxDoubleOccupancy: number;
  paxTripleOccupancy: number;
  taxAndFees: number;
  taxAndFeesPerDay: number;
  totalAmount: number;
  totalDueAmount: number;
  totalPaidAmount: number;
}

interface RatePlan {
  id: string;
  label: string;
  sellingPrice: number;
  total: number;
  isBase: boolean;
}

interface RoomDetails {
  ratePlan: RatePlan;
  roomNumber: string;
  roomTypeId: string;
  roomTypeLabel: string;
  roomCount: number;
}

interface BookingItem {
  roomDetails: RoomDetails;
}

export interface BookingResponse {
  bookingItems: BookingItem[];
  created: number;
  currentJourneyStatus: string;
  currentJourney: string;
  currentJourneyState: string;
  from: number;
  guest: GuestType;
  id: string;
  items: any[];
  journeysStatus: Record<string, string>;
  nextJourneys: Record<string, any>;
  nextStates: string[];
  offer: Offer;
  pricingDetails: PricingDetails;
  reservationNumber: string;
  reservationType: string;
  source: string;
  sourceName: string;
  specialRequest: string;
  state: string;
  status: string;
  to: number;
  updated: number;
  invoiceId?: string;
  groupCode?: string;
  sessionType?: SessionType;
}
