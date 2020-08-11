import { Injectable } from '@angular/core';
import { ReservationService } from './booking.service';
import {
  DocumentDetailDS,
  DocumentDetailsConfigI,
  FileDetailConfigI,
} from '../data-models/documentDetailsConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';

import { isEmpty } from 'lodash';
import { Subject, Observable } from 'rxjs';
import {
  GuestDetails,
  Guest,
  ContactDetails,
  DocumentDetails,
  ReservationDetails,
  FileDetails,
} from '../data-models/reservationDetails';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FormGroup } from '@angular/forms';

@Injectable()
export class DocumentDetailsService extends ApiService {
  private _documnentDetailDS: DocumentDetailDS;
  documentDetailDS$ = new Subject();
  countries;

  initDocumentDetailDS(reservationData) {
    this._documnentDetailDS = new DocumentDetailDS().deserialize(
      reservationData
    );
  }

  setFieldConfigForDocumentDetails(
    countriesList = [],
    dropDownDocumentList = [],
    documentsArray = []
  ) {
    this.countries = countriesList;
    let documentDetailsFieldSchema = {};
    let fileArray = [];

    documentDetailsFieldSchema['nationality'] = new FieldSchema().deserialize({
      label: 'Nationality',
      disable: false,
      options: countriesList,
    });

    documentDetailsFieldSchema[
      'selectedDocumentType'
    ] = new FieldSchema().deserialize({
      label: 'Document Type',
      disable: dropDownDocumentList.length ? false : true,
      options: dropDownDocumentList,
    });

    // if (documentsArray.length > 0) {
    //   documentsArray.forEach((element) => {
    //     fileArray.push(this.setDocumentFileConfig());
    //   });
    // }

    //documentDetailsFieldSchema['documents'] = fileArray;
    return documentDetailsFieldSchema as DocumentDetailsConfigI;
  }

  setDocumentFileConfig(documentTypeLabel?) {
    let fileSchema = {};
    // fileSchema['documentType'] = new FieldSchema().deserialize({
    //   label: 'Document Type',
    //   disable: false,
    // });
    fileSchema['documentFileFront'] = new FieldSchema().deserialize({
      label: `${documentTypeLabel} FIRST PAGE`,
      type: 'front',
      disable: false,
    });
    fileSchema['documentFileBack'] = new FieldSchema().deserialize({
      label: `${documentTypeLabel} BACK PAGE`,
      type: 'back',
      disable: false,
    });
    return fileSchema as FileDetailConfigI;
  }

  modifyDocumentDetails(value, journey) {
    let modifiedValue = {};
    value.documentDetail.guests.forEach((guest) => {
      guest.documents = guest.documents.map((document) => {
        if (
          document.documentType == 'VISA' &&
          journey == 'PRECHECKIN' &&
          isEmpty(document.documentFileFront.trim())
        ) {
          return;
        } else {
          return {
            documentType: document.documentType,
            frontUrl: document.documentFileFront,
            backUrl: document.documentFileBack,
          };
        }
      });

      guest.documents = guest.documents.filter((doc) => doc);

      if (guest.isPrimary) {
        modifiedValue['primaryGuest'] = {
          id: guest.id,
          documents: guest.documents,
        };
      } else {
        if (!modifiedValue['secondaryGuest']) {
          modifiedValue['secondaryGuest'] = [];
        }
        modifiedValue['secondaryGuest'].push({
          id: guest.id,
          documents: guest.documents,
        });
      }
    });
    return modifiedValue;
  }

  updateGuestDetails(reservationId, data): Observable<ReservationDetails> {
    return this.patch(`/api/v1/reservation/${reservationId}/documents`, data);
  }

  uploadDocumentFile(
    reservationId,
    guestId,
    formData
  ): Observable<FileDetails> {
    return this.uploadDocument(
      `/api/v1/reservation/${reservationId}/guest/${guestId}/documents/upload`,
      formData
    );
  }

  getCountryList() {
    return this.get(`/api/v1/countries`);
  }

  getDocumentsByNationality(hotelId, nationality) {
    return this.get(
      `/api/v1/hotel/${hotelId}/support-documents?nationality=${nationality}`
    );
  }

  setDocumentsList(documentsList) {
    const documents = documentsList.map((documents) => {
      return { key: documents.toUpperCase(), value: documents };
    });
    return documents;
  }

  mapDocumentDetailValues(data, value, guestId, documentId) {
    data.id = guestId;
    data.firstName = 'Test';
    data.lastName = 'Test';
    data.email = 'test2gmail.com';
    data.nameTitle = 'Mr.';
    data.type = value.selectedDocument;
    data.nationality = this.getCountryByKey(value.country);
    data.contactDetails = new ContactDetails();
    data.documents = new Array<DocumentDetails>();
    value.documents.forEach((element) => {
      let document = new DocumentDetails();
      document.id = documentId;
      document.documentType = element.documentType;
      document.frontUrl = element.documentFileFront;
      document.backUrl = element.documentFileBack;
      data.documents.push(document);
    });
    data.contactDetails.cc = '+91';
    data.contactDetails.mobileNumber = '9898989898';
    return data;
  }

  getCountryByKey(key) {
    const country = this.countries.find((country) => country.key === key);
    return country.value;
  }

  updateDocumentFG(value, event, fileUploadResponse) {
    if (event.documentPage === 'front') {
      value.get('documentFileFront').patchValue(fileUploadResponse);
    } else {
      value.get('documentFileBack').patchValue(fileUploadResponse);
    }
    return value;
  }

  validateDocumentationForm(documentForm: FormGroup, journey?) {
    let status = [];
    if (documentForm.invalid) {
      status.push({
        validity: false,
        msg: 'Invalid form. Please fill required fields.',
      });
    }

    let documentFormValue = documentForm.getRawValue();

    documentFormValue.documentDetail.guests.forEach((guest, index) => {
      let guestDocuments = guest.documents;
      if (!guestDocuments.length) {
        status.push({
          validity: false,
          msg: 'Please upload documents for guests.',
          data: {
            guestId: guest.id,
            index,
          },
        });
      }

      if (guestDocuments.length) {
        guestDocuments.forEach((document) => {
          if (document.documentType && !guest.isInternational) {
            if (isEmpty(document.documentFileFront.trim())) {
              status.push({
                validity: false,
                msg: `Please upload front document for ${document.documentType}.`,
                data: {
                  guestId: guest.id,
                  index,
                },
              });
            }

            if (isEmpty(document.documentFileBack.trim())) {
              status.push({
                validity: false,
                msg: `Please upload back document for ${document.documentType}.`,
                data: {
                  guestId: guest.id,
                  index,
                },
              });
            }
          }

          if (guest.isInternational) {
            if (document.documentType == 'PASSPORT') {
              if (isEmpty(document.documentFileFront.trim())) {
                status.push({
                  validity: false,
                  msg: `Please upload front document for ${document.documentType}.`,
                  data: {
                    guestId: guest.id,
                    index,
                  },
                });
              }

              if (isEmpty(document.documentFileBack.trim())) {
                status.push({
                  validity: false,
                  msg: `Please upload back document for ${document.documentType}.`,
                  data: {
                    guestId: guest.id,
                    index,
                  },
                });
              }
            }

            if (document.documentType == 'VISA' && journey == 'CHECKIN') {
              if (isEmpty(document.documentFileFront.trim())) {
                status.push({
                  validity: false,
                  msg: `Please upload front document for ${document.documentType}.`,
                  data: {
                    guestId: guest.id,
                    index,
                  },
                });
              }
            }
          }
        });
      }
    });

    return status;
  }

  // updateDocumentDetailDS(value) {
  //   this._documnentDetailDS.deserialize(value);
  //   this.documentDetailDS$.next(this._documnentDetailDS);
  // }

  get documentDetailDS() {
    return this._documnentDetailDS;
  }
}
