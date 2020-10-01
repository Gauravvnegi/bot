import { get, set } from 'lodash';
import { DateService } from '../../../../../shared/utils/src/lib/date.service';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class Details implements Deserializable{
  reservationDetails: ReservationDetailsConfig;
  guestDetails: GuestDetailsConfig[];
  stayDetails: StayDetailsConfig;
  amenitiesDetails: PackageDetailsConfig;
  paymentDetails: PaymentDetailsConfig;
  regCardDetails: RegCardConfig;
  healDeclarationDetails: HealthDeclarationConfig;

  deserialize(input: any) {
    let hotelNationality = input.hotel.address.countryCode;

    input.guestDetails.primaryGuest['isPrimary'] = true;
    input.guestDetails.secondaryGuest.forEach((secondaryGuest) => {
      secondaryGuest['isPrimary'] = false;
    });

    let guestData = [
      input.guestDetails.primaryGuest,
      ...input.guestDetails.secondaryGuest,
    ];

    this.guestDetails = new Array<GuestDetailsConfig>();

    guestData.forEach((guest) => {
      this.guestDetails.push(
        new GuestDetailsConfig().deserialize(guest, hotelNationality)
      );
    });

    this.reservationDetails = new ReservationDetailsConfig().deserialize(input);
    this.stayDetails = new StayDetailsConfig().deserialize(input.stayDetails);
    this.regCardDetails = new RegCardConfig().deserialize(input.guestDetails.primaryGuest)
    this.amenitiesDetails = new PackageDetailsConfig().mapPackage(input.specialAmenities);
    this.paymentDetails = new PaymentDetailsConfig().deserialize(input);
    this.healDeclarationDetails = new HealthDeclarationConfig().deserialize(input);

    return this;
  }
}

export class GuestDetailsConfig implements Deserializable{
  id: string;
  code: number;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  isPrimary: boolean;
  isInternational: boolean;
  countryCode: string;
  phoneNumber: string;
  email: string;
  documents: DocumentDetailsConfig;

  deserialize(input: any, hotelNationality) {
    const contactDetails = new ContactDetailsConfig().deserialize(input.contactDetails);
    let documents = new Array<DocumentDetailsConfig>();
     input.documents.forEach(document => {
       documents.push(new DocumentDetailsConfig().deserialize(document));
     })
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'code', get(input, ['code'])),
      set({}, 'title', get(input, ['nameTitle'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      set({}, 'countryCode', get(contactDetails, ['cc'])),
      set({}, 'phoneNumber', get(contactDetails, ['contactNumber'])),
      set({}, 'email', get(contactDetails, ['email'])),
      set({}, 'isPrimary', get(input, ['isPrimary'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'isInternational', get(input, ['nationality']) === hotelNationality? false: true),
      set({}, 'documents', documents),
    )
    return this;
  }
}

export class StayDetailsConfig implements Deserializable{
  code: string;
  arrivalTime: string;
  departureTime: string;
  roomType: string;
  kidsCount: number;
  adultsCount: number;

  deserialize(input: any) {
    let service = new DateService();
    Object.assign(
      this,
      set({}, 'code', get(input, ['code'])),
      set({}, 'arrivalTime', new DateService().convertTimestampToDate(get(input, ['arrivalTime']),'DD/MM/YYYY')),
      set({}, 'departureTime', new DateService().convertTimestampToDate(get(input, ['departureTime']),'DD/MM/YYYY')),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount'])),
    )
    return this;
  }
}

export class DocumentDetailsConfig implements Deserializable {
  verificationStatus = false;
  id: string;
  documentType: string;
  frontUrl: string;
  backUrl: string;
  remark: string;

  deserialize(input: any){
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'documentType', get(input, ['documentType'])),
      set({}, 'frontUrl', get(input, ['frontUrl'])),
      set({}, 'backUrl', get(input, ['backUrl'])),
      set({}, 'verificationStatus', false),
      set({}, 'remark', ''),
    );
   return this;
  }
}

export class ContactDetailsConfig implements Deserializable {
  cc: string;
  contactNumber: string;
  email: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'cc', get(input, ['cc'])),
      set({}, 'contactNumber', get(input, ['contactNumber'])),
      set({}, 'email', get(input, ['emailId'])),
    )
    return this;
  }
}

export class HealthDeclarationConfig implements Deserializable{
  isAccepted;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'isAccepted', 'Pending'),
    )
    return this;
  }
}

export class ReservationDetailsConfig implements Deserializable{
  bookingId: string;
  roomNumber: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'bookingId', get(input, ['id'])),
      set({}, 'roomNumber', get(input, ['roomNumber'])),
    )
    return this;
  }
}

export class RegCardConfig implements Deserializable{
  isRegUrl = false;
  isSignUrl = false;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'isRegUrl', get(input, ['regcardUrl'])),
      set({}, 'isSignUrl', get(input, ['signUrl'])),
    )
    return this;
  }
}

export class PackageDetailsConfig {

  complementaryPackage = new Array<Package>();
  paidPackage = new Array<Package>();

  mapPackage(input: any){

    input.complementryAmenities.forEach(element => {
      this.complementaryPackage.push(new Package().deserialize(element));
    });

    input.paidAmenities.forEach(element => {
      this.paidPackage.push(new Package().deserialize(element));
    });
    return this;
  }
}

export class PaymentDetailsConfig implements Deserializable{
  guestId: string
  arrivalTime: string
  departureTime: string
  expectedArrivalTime: string
  roomType: number
  kidsCount: number
  adultsCount: number
  title: string
  firstName: string
  lastName: string
  countryCode: string
  phoneNumber: string
  email: string
  isPrimary: boolean

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'bookingId', get(input, ['id'])),
      set({}, 'arrivalTime', new DateService().convertTimestampToDate(get(input.stayDetails, ['arrivalTime']),'DD/MM/YYYY')),
      set({}, 'departureTime', new DateService().convertTimestampToDate(get(input.stayDetails, ['departureTime']),'DD/MM/YYYY')),
      set({}, 'currentDate', new DateService().currentDate('DD/MM/YYYY')),
      set({}, 'expectedArrivalTime', get(input.stayDetails, ['iexpectedArrivalTimed'])),
      set({}, 'roomType', get(input.stayDetails, ['roomType'])),
      set({}, 'roomNumber', ''),
      set({}, 'kidsCount', get(input.stayDetails, ['kidsCount'])),
      set({}, 'adultsCount', get(input.stayDetails, ['adultsCount'])),
      set({}, 'roomsCount', ''),
      set({}, 'title', get(input.guestDetails.primaryGuest, ['nameTitle'])),
      set({}, 'firstName', get(input.guestDetails.primaryGuest, ['firstName'])),
      set({}, 'lastName', get(input.guestDetails.primaryGuest, ['lastName'])),
      set({}, 'countryCode', get(input.guestDetails.primaryGuest.contactDetails, ['cc'])),
      set({}, 'phoneNumber', get(input.guestDetails.primaryGuest.contactDetails, ['contactNumber'])),
    )
    return this;
  }
}

export class Package implements Deserializable{
  
  active: boolean
  amenityDescription: string
  amenityName: string
  id: string
  imgUrl: string
  metaData: any
  packageCode: string
  quantity: number
  rate: number
  type: number

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'active', get(input, ['active'])),
      set({}, 'amenityDescription', get(input, ['amenityDescription'])),
      set({}, 'amenityName', get(input, ['amenityName'])),
      set({}, 'id', get(input, ['id'])),
      set({}, 'imgUrl', get(input, ['imgUrl'])),
      set({}, 'metaData', get(input, ['metaData'])),
      set({}, 'quantity', get(input, ['quantity'])),
      set({}, 'rate', get(input, ['rate'])),
      set({}, 'type', get(input, ['type'])),
      set({}, 'packageCode', get(input, ['packageCode']))
    )
    return this;
  }
}

export class AdminDetailStatus {
  isHealthDeclarationAccepted: boolean;
  isHealthDeclarationInitiatd: boolean;
  isDocumentsAccepted: boolean;
  isDocumentsInitiated: boolean;
}