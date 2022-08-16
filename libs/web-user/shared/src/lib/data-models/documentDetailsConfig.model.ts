import { get, set } from 'lodash';
import { GuestRole } from '../constants/guest';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class DocumentDetailDS implements Deserializable {
  guests: DocumentDetail[];

  deserialize(input: any) {
    let hotelNationality = input.hotel.address.countryCode;

    // input.guestDetails.primaryGuest['isPrimary'] = true;
    // input.guestDetails.sharerGuests.forEach((secondaryGuest) => {
    //   secondaryGuest['isPrimary'] = false;
    // });

    let guestData = [];

    guestData.push({
      ...input.guestDetails.primaryGuest,
      ...{
        role: GuestRole.undefined,
        label: 'Primary Guest',
        isPrimary: true,
      },
    });

    input.guestDetails.sharerGuests &&
      input.guestDetails.sharerGuests.forEach((guest) => {
        guestData.push({
          ...guest,
          role: GuestRole.sharer,
          label: 'Sharer',
          isPrimary: false,
        });
      });

    input.guestDetails.accompanyGuests &&
      input.guestDetails.accompanyGuests.forEach((guest) => {
        guestData.push({
          ...guest,
          role: GuestRole.accompany,
          label: 'Accompany / Kids (Optional)',
          isPrimary: false,
        });
      });

    input.guestDetails.kids &&
      input.guestDetails.kids.forEach((guest) => {
        guestData.push({
          ...guest,
          role: GuestRole.kids,
          label: 'Accompany / Kids (Optional)',
          isPrimary: false,
        });
      });

    this.guests = new Array<DocumentDetail>();

    guestData.forEach((guest) => {
      this.guests.push(
        new DocumentDetail().deserialize(guest, hotelNationality)
      );
    });
    return this;
  }
}

export class DocumentDetail implements Deserializable {
  nationality: string;
  selectedDocumentType: string;
  documents = new Array<Document>();
  isInternational: boolean;
  isPrimary: boolean;
  label: string;
  id: string;
  role: string;
  uploadStatus: boolean;
  validDocs: boolean;

  deserialize(input: any, hotelNationality: string) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'role', get(input, ['role']))
    );
    this.uploadStatus = false;
    this.validDocs = false;
    this.nationality = input.nationality || hotelNationality;
    this.isInternational = this.nationality !== hotelNationality;
    this.id = input.id;
    this.isPrimary = input.isPrimary;

    if (this.isInternational) {
      this.selectedDocumentType =
        input.documents &&
        input.documents.map((item) => item.documentType).join('/');
    } else {
      this.selectedDocumentType =
        this.nationality === hotelNationality
          ? input.documents && input.documents[0]
            ? input.documents[0].documentType
            : null
          : null;
    }

    input.documents.forEach((document, i) => {
      this.documents.push(new Document().deserialize(document));
      if (i === input.documents.length - 1) {
        this.uploadStatus = true;
        this.validDocs = true;
      }
    });
    return this;
  }
}

class Document implements Deserializable {
  documentType: string;
  documentFileFront: string;
  documentFileBack: string;
  id;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'documentFileFront', get(input, ['frontUrl'])),
      set({}, 'documentFileBack', get(input, ['backUrl'])),
      set({}, 'documentType', get(input, ['documentType']))
    );
    return this;
  }
}

export interface DocumentDetailsConfigI {
  nationality: FieldSchema;
  selectedDocumentType: FieldSchema;
  documents: FileDetailConfigI[];
}

export interface FileDetailConfigI {
  documentType: FieldSchema;
  documentFileFront: FieldSchema;
  documentFileBack: FieldSchema;
}
