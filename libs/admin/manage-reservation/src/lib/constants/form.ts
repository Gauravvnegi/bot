import {
  AddedRatePlans,
  ReservationRatePlan,
} from 'libs/admin/room/src/lib/constant/form';

export type ReservationForm = {
  reservationInformation: ReservationInformation;
  guestInformation: GuestInformation;
  roomInformation?: RoomInformation;
  orderInformation?: OrderInformation;
  bookingInformation?: BookingInformation;
  eventInformation?: EventInformation;
  instructions?: Instructions;
  address: Address;
  paymentRule: PaymentRule;
  paymentMethod: PaymentMethod;
  offerId: string;
};

type ReservationInformation = {
  from?: number;
  to?: number;
  dateAndTime: number;
  reservationType?: string;
  source: string;
  sourceName: string;
  marketSegment: string;
  status?: string;
  eventType?: string;
};

type GuestInformation = {
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

type Instructions = {
  specialInstructions?: string;
};

type RoomInformation = {
  roomTypes: RoomTypes[];
};

export type RoomTypes = {
  roomTypeId: string;
  ratePlan: string;
  roomCount: number;
  roomNumbers?: string[];
  roomNumber?: string;
  adultCount: number;
  childCount: number;
  roomTypeLabel?: string;
  allRatePlans?: ReservationRatePlan;
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

type PaymentRule = {
  amountToPay: number;
  deductedAmount: number;
  makePaymentBefore: number;
  inclusionsAndTerms: string;
};

export type PaymentMethod = {
  cashierFirstName: string;
  cashierLastName: string;
  totalPaidAmount: number;
  currency: string;
  paymentMethod: string;
  paymentRemark: string;
  transactionId: string;
};
