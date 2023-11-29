//directAgentBillingReport
export type DirectAgentBillingReportData = {
  agentCode: string;
  agentName: string;
  bookingNo: string;
  guestName: string;
  roomType: string;
  roomNo: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  pax: number;
  totalPaidAmount: number;
  totalDueAmount: number;
};

export type DirectAgentBillingReportResponse = {
  agent: Agent;
  id: string;
  from: number;
  to: number;
  reservationType: string;
  reservationNumber: string;
  status: string;
  nightCount: number;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    contactDetails: {
      cc: string;
      contactNumber: string;
      emailId: string;
    };
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
      code: string;
      documentRequired: boolean;
    };
    nationality: string;
    age: number;
    firstStay: number;
    lastStay: number;
    totalNights: number;
    documentRequired: boolean;
  };
  created: number;
  updated: number;
  pricingDetails: {
    totalAmount: number;
    totalPaidAmount: number;
    totalDueAmount: number;
    taxAndFees: number;
    taxAndFeesPerDay: number;
    basePrice: number;
    discountedAmount: number;
  };
  bookingItems: Array<{
    roomDetails: {
      roomNumber: string;
      roomTypeId: string;
      roomTypeLabel: string;
      roomCount: number;
    };
    pricingDetails: {
      totalAmount: number;
      totalPaidAmount: number;
      totalDueAmount: number;
      taxAndFees: number;
      taxAndFeesPerDay: number;
      basePrice: number;
      discountedAmount: number;
    };
    id: string;
    occupancyDetails: {
      maxChildren: number;
      maxAdult: number;
    };
  }>;
};

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc: string;
    contactNumber: string;
    emailId: string;
  };
  nationality: string;
  address: {
    city: string;
    state: string;
    countryCode: string | undefined;
    postalCode: string;
    addressLine1: string;
  };
  age: number;
  firstStay: number;
  lastStay: number;
  totalNights: number;
  company: Company;
  code: string;
  documentRequired: boolean;
};

interface Company {
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
  code: string;
  documentRequired: boolean;
}

//directCompanyBillingReport
export type DirectCompanyBillingReportData = {
  companyCode: string;
  companyName: string;
  bookingNo: string;
  guestName: string;
  roomType: string;
  roomNo: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  pax: number;
  totalAmount: number;
  postTaxAmount: number;
  totalPaidAmount: number;
  totalDueAmount: number;
};

export type DirectCompanyBillingReportResponse = DirectAgentBillingReportResponse & {};
