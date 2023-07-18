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

type SpaItems = {
  serviceName: string;
  quantity: number;
  price: number;
};

type Instructions = {
  specialInstructions?: string;
};

type RoomInformation = {
  roomTypes: RoomTypes[];
};

export type RoomTypes = {
  roomTypeId: string;
  ratePlanId: string;
  roomCount: number;
  roomNumber: string[];
  adultCount: number;
  childCount: number;
};

type OrderInformation = {
  tableNumber: string;
  numberOfAdults: number;
  menuItems: MenuItemsData[];
  kotInstructions: string;
};

type EventInformation = {
  venueInfo: VenueItemsData[];
};

type VenueItemsData = {
  description: string;
  quantity: number;
  price: number;
};

type MenuItemsData = {
  menuItems: string;
  quantity: number;
  price: number;
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

type PaymentMethod = {
  cashierFirstName: string;
  cashierLastName: string;
  totalPaidAmount: number;
  currency: string;
  paymentMethod: string;
  paymentRemark: string;
  transactionId: string;
};
