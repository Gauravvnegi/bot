import { SearchGuestResponse } from 'libs/admin/guests/src/lib/types/guest.type';

interface JourneyStatus {
  [key: string]: string;
}

interface StepsStatus {
  [key: string]: string;
}

interface Address {
  id: string;
  city: string;
  country: string;
  streetAddress: string;
  latitude: number;
  longitude: number;
  pincode: number;
  formattedAddress: string;
  countryCode: string;
  nationality: string;
}

interface ImageUrl {
  url: string;
  isFeatured: boolean;
}

interface SocialPlatform {
  id: string;
  name: string;
  imageUrl: string;
  redirectUrl: string;
}

interface Contact {
  countryCode: string;
  number: string;
}

interface Entity {
  id: string;
  category: string;
  privacyPolicyUrl: string;
  name: string;
  imageUrl: ImageUrl[];
  logo: string;
  address: Address;
  timezone: string;
  footerLogo: string;
  websiteUrl: string;
  socialPlatforms: SocialPlatform[];
  favIcon: string;
  showAddress: boolean;
  termsUrl: string;
  childEntity: any[];
  contact: Contact;
  parentId: string;
  emailId: string;
  rules: any[];
  description: string;
  currency: string;
  openNow: boolean;
}

interface GuestDetails {
  statusMessage: any;
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: Contact;
  documents: any[];
  regcardUrl: string;
  age: number;
  privacy: boolean;
  documentRequired: boolean;
  company: GuestDetails;
}

interface RoomDetails {
  roomNumber: string;
  type: string;
  unit: number;
  status: string;
}

interface StayDetails {
  statusMessage: any;
  arrivalTime: number;
  departureTime: number;
  expectedArrivalTime: number;
  expectedDepartureTime: number;
  adultsCount: number;
  kidsCount: number;
  comments: string;
  room: RoomDetails;
  checkInComment: string;
  address: any;
}

interface PaymentSummary {
  statusMessage: any;
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  currency: string;
  printRate: boolean;
  packages: any[];
  signatureUrl: string;
}

export interface CheckoutPendingResponse {
  id: string;
  updated: number;
  arrivalTime: number;
  departureTime: number;
  number: string;
  pmsStatus: string;
  state: string;
  stateCompletedSteps: string;
  redirectionParameter: any;
  stayDetails: StayDetails;
  guestDetails: {
    allGuest: Record<string, GuestDetails>;
    primaryGuest: GuestDetails;
  };
  paymentSummary: PaymentSummary;
  journeysStatus: JourneyStatus;
  stepsStatus: StepsStatus;
  lastCompletedStep: string;
  currentJourney: string;
  currentJoureyStatus: string;
  currentJourneyState: string;
  entity: Entity;
  nextJourneys: any;
  totalDueAmount: number;
  totalPaidAmount: number;
  totalAmount: number;
  vip: boolean;
  pmsBooking: boolean;
  invoicePrepareRequest: boolean;
  invoiceCode?: string;
}
