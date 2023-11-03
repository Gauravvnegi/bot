export type GuestHistoryData = {
  guestName: string;
  firstStayed: string;
  lastStayed: string;
  noOfResv: number;
  roomCharges: number;
  roomTax: number;
  otherCharges: number;
  totalCharges: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
};

export type SalesByGuestData = {
  guestId: string;
  firstName: string;
  LastName: string;
  country: string;
  emailId: string;
  firstStayed: string;
  lastStayed: string;
  noOfRes: number;
  nights: number;
  totalSales: number;
};

export type SalesByGuestResponse = GuestHistoryResponse & {
  totalSales: number;
};

export type GuestHistoryResponse = {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  nationality: string;
  dateOfBirth: number;
  address: {
    city: string;
    state: string;
    countryCode: string;
    postalCode: string;
    addressLine1: string;
  };
  reservation: any[];
  age: number;
  gender: string;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  company: {
    id: string;
    firstName: string;
    contactDetails: {
      cc: string;
      contactNumber: string;
      emailId: string;
    };
    age: number;
    firstStay: number;
    lastStay: number;
    totalNights: number;
    documentRequired: boolean;
  };
  documentRequired: boolean;
};
