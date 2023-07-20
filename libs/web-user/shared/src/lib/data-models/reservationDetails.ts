export class ReservationDetails {
  id: string;
  number: string;
  status: string;
  state: string;
  stateCompletedSteps: number;
  stateMessage: object;
  stayDetails: StayDetails;
  guestDetails: GuestDetails;
  paymentSummary: object;
  redirectionParameter: any;
  healthDeclaration: Object;
  currentJourney: string;
  entity: Entity;
}

export class StayDetails {
  arrivalTime: number;
  departureTime: number;
  roomType: string;
  adultsCount: number;
  kidsCount: number;
  comments: string;
}

export class Guest {
  id: string;
  nameTitle: string;
  firstName: string;
  lastName: string;
  contactDetails: ContactDetails;
  email: string;
  type: object;
  nationality: object;
  document: DocumentDetails[];
  healthDeclarationFormId: object;
  pmsGuestId: object;
  regcardUrl: string;
  signatureUrl: string;
}

export class GuestDetails {
  primaryGuest: Guest;
  secondaryGuest: Guest[];
}

export class ContactDetails {
  cc: string;
  mobileNumber: string;
  emailId: string;
}

export class DocumentDetails {
  id: string;
  documentType: string;
  frontUrl: string;
  backUrl: string;
}

export class Entity {
  id: string;
  name: string;
}

export class FileDetails {
  fileName: string;
  fileType: string;
  fileDownloadUrl: string;
  size: string;
}
