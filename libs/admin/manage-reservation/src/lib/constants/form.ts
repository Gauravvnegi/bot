export type RestaurantFormData = {
  reservationInformation: {
    reservationDateAndTime: string;
    reservationType: string;
    status: string;
    source: string;
    sourceName: string;
    marketSegment: string;
  };
  orderInformation: {
    tableNumber: string;
    numberOfAdults: string;
    menuItems: any[];
    kotInstructions: string;
  };
  guestInformation: GuestInfo;
  address: Address;
  paymentRule: PaymentRule;
  paymentMethod: PaymentMethod;
  offerId: string;
};

export type Address = {
  addressLine1: string;
  city: string;
  countryCode: string;
  postalCode: string;
};

export type PaymentRule = {
  amountToPay: number;
  deductedAmount: string;
  makePaymentBefore: string;
  inclusionsAndTerms: string;
};

export type GuestInfo = {
  guestDetails: string;
};

export type PaymentMethod = {
  cashierFirstName: string;
  cashierLastName: string;
  totalPaidAmount: string;
  currency: string;
  paymentMethod: string;
  paymentRemark: string;
  transactionId: string;
};
