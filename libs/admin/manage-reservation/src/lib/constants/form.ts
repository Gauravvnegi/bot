import { Option } from '@hospitality-bot/admin/shared';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { ReservationRatePlan } from 'libs/admin/room/src/lib/constant/form';

export const SessionType = {
  DAY_BOOKING: 'DAY_BOOKING',
  NIGHT_BOOKING: 'NIGHT_BOOKING',
} as const;

export type SessionType = typeof SessionType[keyof typeof SessionType];

export const sessionTypeOptions: Option<SessionType>[] = [
  {
    label: '21 Days',
    value: SessionType.NIGHT_BOOKING,
  },
  {
    label: 'Day',
    value: SessionType.DAY_BOOKING,
  },
];

export type ReservationForm = {
  reservationInformation: ReservationInformation;
  guestInformation: GuestInformation;
  roomInformation?: RoomInformation;
  orderInformation?: OrderInformation;
  bookingInformation?: BookingInformation;
  eventInformation?: EventInformation;
  instructions?: Instructions;
  address: Address;
  paymentRule: PaymentRuleForm;
  paymentMethod: PaymentMethod;
  offerId: string;
  printRate?: boolean;
  dailyPrice?: string;
  rateImprovement?: boolean;
  agent?: AgentTableResponse;
  company?: CompanyResponseType;
};

export type ReservationInformation = {
  from?: number;
  to?: number;
  dateAndTime?: number;
  reservationType?: string;
  source: string;
  sourceName?: string;
  marketSegment: string;
  status?: string;
  eventType?: string;
  agentSourceName?: string;
  otaSourceName?: string;
  companySourceName?: string;
  sessionType: string;
  slotId: string;
};

export type GuestInformation = {
  guestDetails: string;
};

type BookingInformation = {
  numberOfAdults: number;
  spaItems: SpaItems[];
};

export type SpaItems = {
  serviceName: string;
  unit: number;
  amount: number;
};

export type Instructions = {
  specialInstructions?: string;
};

export type RoomInformation = {
  roomTypes?: RoomTypes[];

  // For quick form
  roomTypeId?: string;
  ratePlanId?: string;
  roomNumber?: string;
  adultCount?: number;
  childCount?: number;
  id?: string;
  roomCount?: number;
  roomNumbers?: string[];
};

export type RoomTypes = {
  roomTypeId: string;
  ratePlanId: string;
  roomCount: number;
  roomNumbers?: string[];
  roomNumber?: string;
  adultCount: number;
  childCount: number;
  roomTypeLabel?: string;
  ratePlans?: ReservationRatePlan;
  rooms?: Option[];
  id?: string;
};

export type OrderInformation = {
  tableNumber: string;
  numberOfAdults: number;
  foodPackages: FoodPackages[];
  menuItems: MenuItemsData[];
  kotInstructions: string;
};

export type FoodPackages = {
  type: string;
  count: number;
};

type EventInformation = {
  numberOfAdults: number;
  foodPackages: FoodPackages[];
  venueInfo: VenueItemsData[];
};

export type VenueItemsData = {
  description: string;
  unit: number;
  amount: number;
};

export type MenuItemsData = {
  menuItems: string;
  unit: number;
  amount: number;
};

type Address = {
  addressLine1: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
};

export type PaymentRuleForm = {
  amountToPay: number;
  deductedAmount: number;
  makePaymentBefore: number;
  inclusionsAndTerms: string;
  type?: string;
  partialPayment?: boolean;
};

export type PaymentMethod = {
  cashierFirstName: string;
  cashierLastName: string;
  cashierId?: string;
  totalPaidAmount: number;
  currency: string;
  paymentMethod: string;
  paymentRemark: string;
  transactionId: string;
};
