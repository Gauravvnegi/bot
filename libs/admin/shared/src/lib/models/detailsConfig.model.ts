import { get, set, merge, concat } from 'lodash';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class Details implements Deserializable{
  guestDetails: GuestDetailsConfig[];
  stayDetails: StayDetailsConfig;
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

    this.stayDetails = new StayDetailsConfig().deserialize(input.stayDetails);

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
  //contactDetails: ContactDetailsConfig;
  documentDetails: DocumentDetailsConfig;

  deserialize(input: any, hotelNationality) {
    const contactDetails = new ContactDetailsConfig().deserialize(input.contactDetails)
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'code', get(input, ['code'])),
      set({}, 'title', get(input, ['nameTitle'])),
      set({}, 'firstName', get(input, ['firstName'])),
      set({}, 'lastName', get(input, ['lastName'])),
      //set({}, 'fullName', input.nameTitle + input.firstName + input.lastName),
      //set({}, 'phoneNumber', input.contactDetails.cc + input.contactDetails.contactNumber),
      set({}, 'countryCode', get(contactDetails, ['countryCode'])),
      set({}, 'phoneNumber', get(contactDetails, ['contactNumber'])),
      set({}, 'email', get(contactDetails, ['email'])),
      set({}, 'isPrimary', get(input, ['isPrimary'])),
      set({}, 'nationality', get(input, ['nationality'])),
      set({}, 'isInternational', get(input, ['nationality']) === hotelNationality? false: true),
      set({}, 'documentDetails', new DocumentDetailsConfig().deserialize(input.documents)),
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
    Object.assign(
      this,
      set({}, 'code', get(input, ['code'])),
      set({}, 'arrivalTime', get(input, ['arrivalTime'])),
      set({}, 'departureTime', get(input, ['departureTime'])),
      set({}, 'roomType', get(input, ['roomType'])),
      set({}, 'kidsCount', get(input, ['kidsCount'])),
      set({}, 'adultsCount', get(input, ['adultsCount'])),
    )
    return this;
  }
}

export class DocumentDetailsConfig implements Deserializable {
  verificationStatus = false;
  docFile: FileDetailsConfig[];

  deserialize(input: any){
    this.docFile = new Array<FileDetailsConfig>();
    input.forEach(document => {
      this.docFile.push(new FileDetailsConfig().deserialize(document));
     })
    Object.assign(
      this,
      //set({}, 'verificationStatus', get(input, ['verificationStatus'])),
      set({}, 'docFile', this.docFile),
    );
   return this;
  }
}

export class FileDetailsConfig implements Deserializable {
  id: string;
  documentType: string;
  frontUrl: string;
  backUrl: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'documentType', get(input, ['documentType'])),
      set({}, 'frontUrl', get(input, ['frontUrl'])),
      set({}, 'backUrl', get(input, ['backUrl'])),
    )
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

export class HealthDeclarationConfig {
  isAccepted = false;
}

export class RegCardConfig {
  isAccepted = false;
}