import { JourneyStatus } from '@hospitality-bot/admin/reservation';
import { GuestDatatableModalComponent } from '../components';
import { Address, EntityState } from '@hospitality-bot/admin/shared';
import { SocialPlatForms } from 'libs/admin/business/src/lib/types/brand.type';
import { ImageUrl } from 'libs/admin/room/src/lib/types/service-response';
import { TransactionHistory } from 'libs/admin/shared/src/lib/models/detailsConfig.model';

export type ChartTypeOption = {
  name: string;
  value: string;
  url: string;
  backgroundColor: string;
};

export type SelectedEntityState = {
  entityState: string;
};

export type SearchGuestResponse = {
  id: string;
  salutation?: string;
  firstName: string;
  lastName: string;
  contactDetails: {
    cc?: string;
    contactNumber?: string;
    emailId?: string;
  };
  nationality?: string;
  age: number;
};

export type GuestModalStatus =
  | 'BOT'
  | 'EMAIL'
  | 'MICROSITE'
  | 'OTHERS'
  | 'WHATSAPP';

export type GuestDialogData = Partial<GuestDatatableModalComponent>;

export type GuestModalType =
  | 'payment.title'
  | 'document.title'
  | 'source.title';

export type GuestListResponse = {
  records: GuestReservationType[];
  total: number;
  entityStateCounts: EntityState<string>;
  entityStateLabels: EntityState<string>;
};

export type GuestAddress = {
  addressLine1: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
  id?: string;
};

export type GuestReservationType = {
  arrivalTime: number;
  created: number;
  currentJourneyStatus: string;
  currentJourney: string;
  currentJourneyState: string;
  departureTime: number;
  entity: {
    address: Address;
    contact: ContactDetails;
    containerCharge: number;
    currency: string;
    description: string;
    emailId: string;
    favIcon: string;
    footerLogo: string;
    gstNumber: string;
    id: string;
    imageUrl: ImageUrl[];
    logo: string;
    name: string;
    openNow: boolean;
    parentId: string;
    privacyPolicyUrl: string;
    rules: any[];
    showAddress: boolean;
    status: string;
    termsUrl: string;
    timezone: string;
    websiteUrl: string;
    socialPlatform: SocialPlatForms[];
  };
  guestDetails: {
    accompanyGuest: [];
    allGuest: allGuest;
    kids: [];
    primaryGuest: PrimaryGuest;
    secondaryGuest: [];
    sharerGuests: [];
  };
  healthDeclarations: HealthDeclaration;
  invoicePreparationRequest: boolean;
  lastCompletedStep: string;
  id: string;
  nextJourneys: {};
  nightCount: number;
  journeyStatus: JourneyStatus;
  number: string;
  packages: Packages;
  paymentSummary: PaymentSummary;
  pmsBooking: boolean;
  pmsStatus: string;
  redirectParameter: {
    journey: {
      token: string;
    };
    source: string;
    staate: string;
    stateCompletedSteps: string;
  };
  stayDetails: StayDetails;
  stepsStatus: StepsStatus;
  totalAmount: number;
  totalDueAmount: number;
  totalPaidAmount: number;
  updateOn: number;
  updated: number;
  vip: boolean;
};

type StepsStatus = {
  DOCUMENTS: string;
  GUESTDETAILS: string;
  HEALTHDECLARATION: string;
  PAYMENT: string;
  STAYDETAILS: string;
};

type StayDetails = {
  address: {};
  adultsCount: number;
  arrivalTime: number;
  checkInComment: string;
  comments: string;
  departureTime: number;
  expectedArrivalTime: number;
  expectedDepartureTime: number;
  kidsCount: number;
  room: { roomNumber: string; status: string; type: string; unit: number };
  statusMessage: StatusMessage;
  totalRoomCount: number;
};

interface RoomRate {
  base: number;
  totalAmount: number;
  amount: number;
  discount: number;
  description: string;
  label: string;
  unit: number;
  cgstAmount: number;
  sgstAmount: number;
}

interface DepositRules {
  id: string;
  amount: number;
  label: string;
  guaranteeType: string;
  type: string;
  depositNight: number;
  payAtDesk: boolean;
  dueDate: number;
}
type PaymentSummary = {
  statusMessage: StatusMessage;
  totalAmount: number;
  taxAmount: number;
  totalDiscount: number;
  paidAmount: number;
  dueAmount: number;
  payableAmount: number;
  currency: string;
  roomRates: RoomRate[];
  inclusions: string;
  printRate: boolean;
  packages: any[];
  transactionsHistory: Omit<TransactionHistory, 'deserialize'>[];
  depositRules: DepositRules;
  paymentAmount: number;
  totalCgstTax: number;
  totalSgstTax: number;
  totalAddOnsAmount: number;
  totalRoomCharge: number;
  totalRoomDiscount: number;
  totalAddOnsTax: number;
  totalAddOnsDiscount: number;
  totalAllowance: number;
  containerCharge: number;
};
type Packages = {
  complimentaryPackages: complimentaryPackages[];
};

type complimentaryPackages = {
  description: string;
  hasChild: boolean;
  id: string;
  imageUrl: string[];
  name: string;
  packageCode: string;
  packageId: string;
  rate: number;
  statusMessage: StatusMessage;
  updates: boolean;
};

type HealthDeclaration = {
  statusMessage: StatusMessage;
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  documents: any[];
  regcardUrl: string;
  age: number;
  privacy: boolean;
  documentRequired: boolean;
};

type PrimaryGuest = {
  statusMessage: StatusMessage;
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  documents: any[];
  regcardUrl: string;
  age: number;
  privacy: boolean;
  documentRequired: boolean;
};

type StatusMessage = {
  code: number;
  status: string;
  state: string;
  remarks: null | string;
};

type ContactDetails = {
  cc: string;
  contactNumber: string;
  emailId: string;
};

type allGuest = {
  statusMessage: StatusMessage;
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  nationality: string;
  documents: any[];
  regcardUrl: string;
  age: number;
  privacy: boolean;
  documentRequired: boolean;
};
