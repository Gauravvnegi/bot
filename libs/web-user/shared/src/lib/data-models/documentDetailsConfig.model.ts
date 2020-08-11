import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(input: any, hotelNationality: string): this;
}

export class DocumentDetailDS implements Deserializable {
  guests: DocumentDetail[];

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
  id: string;

  deserialize(input: any, hotelNationality: string) {
    this.nationality = input.nationality || hotelNationality;
    this.isInternational = this.nationality !== hotelNationality;
    this.id = input.id;
    this.isPrimary = input.isPrimary;

    this.selectedDocumentType =
      this.nationality === hotelNationality
        ? input.documents && input.documents[0]
          ? input.documents[0].documentType
          : null
        : null;

    input.documents.forEach((document) => {
      this.documents.push(new Document().deserialize(document));
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
