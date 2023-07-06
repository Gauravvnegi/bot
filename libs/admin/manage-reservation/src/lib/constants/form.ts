export type ReservationForm = {
  reservationInformation: ReservationInformation;
  guestInformation: GuestInformation;
  roomInformation?: RoomInformation;
  orderInformation?: OrderInformation;
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
  dateAndTime: string;
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

type Instructions = {
  specialInstructions?: string;
};

type RoomInformation = {
  roomTypeId: string;
  roomCount: number;
  roomNumber: number;
  adultCount: number;
  childCount: number;
};

type OrderInformation = {
  tableNumber: string;
  numberOfAdults: string;
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
  totalPrice: number;
};

type MenuItemsData = {
  menuItems: string;
  quantity: number;
  price: number;
};

type Address = {
  addressLine1: string;
  city: string;
  countryCode: string;
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
