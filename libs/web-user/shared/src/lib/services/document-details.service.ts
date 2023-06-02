import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { isEmpty } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuestRole } from '../constants/guest';
import {
  DocumentDetailDS,
  DocumentDetailsConfigI,
  FileDetailConfigI,
} from '../data-models/documentDetailsConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';
import {
  ContactDetails,
  DocumentDetails,
  FileDetails,
  ReservationDetails,
} from '../data-models/reservationDetails';

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
    requiredList,
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
      required: requiredList.includes('nationality'),
    });

    documentDetailsFieldSchema[
      'selectedDocumentType'
    ] = new FieldSchema().deserialize({
      label: 'Document Type',
      disable: false,
      options: dropDownDocumentList,
      required: requiredList.includes('selectedDocumentType'),
    });
    return documentDetailsFieldSchema as DocumentDetailsConfigI;
  }

  setDocumentFileConfig(required, documentTypeLabel?) {
    let fileSchema = {};

    // For visa type document -> visa page is front and visa stamp is back
    const notVisaType = documentTypeLabel != 'VISA';

    fileSchema['documentFileFront'] = new FieldSchema().deserialize({
      label: `${documentTypeLabel} ${notVisaType ? 'FIRST' : ''} PAGE`,
      type: 'front',
      disable: false,
      required,
    });
    fileSchema['documentFileBack'] = new FieldSchema().deserialize({
      label: notVisaType
        ? `${documentTypeLabel} BACK PAGE`
        : 'VISA ARRIVAL STAMP PAGE',
      type: 'back',
      disable: false,
      required: notVisaType ? required : false,
    });
    return fileSchema as FileDetailConfigI;
  }

  modifyDocumentDetails(value, journey) {
    let modifiedValue = {};
    value.documentDetail.guests.forEach((guest) => {
      guest.documents = guest.documents.map((document) => {
        if (
          document.documentType === 'VISA' &&
          journey === 'PRECHECKIN' &&
          isEmpty(document.documentFileFront.trim())
        ) {
          return;
        } else {
          return {
            documentType: document.documentType,
            frontUrl: document.documentFileFront.trim(),
            backUrl: document.documentFileBack.trim(),
          };
        }
      });

      guest.documents = guest.documents.filter((doc) => doc);

      if (guest.isPrimary) {
        modifiedValue['primaryGuest'] = {
          id: guest.id,
          documents: guest.documents,
        };
      } else if (guest.role === GuestRole.accompany) {
        if (!modifiedValue['accompanyGuests']) {
          modifiedValue['accompanyGuests'] = [];
        }
        modifiedValue['accompanyGuests'].push({
          id: guest.id,
          documents: guest.documents,
        });
      } else if (guest.role === GuestRole.kids) {
        if (!modifiedValue['kids']) {
          modifiedValue['kids'] = [];
        }
        modifiedValue['kids'].push({
          id: guest.id,
          documents: guest.documents,
        });
      } else if (guest.role === GuestRole.sharer) {
        if (!modifiedValue['sharerGuests']) {
          modifiedValue['sharerGuests'] = [];
        }
        modifiedValue['sharerGuests'].push({
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
      `/api/v1/entity/${hotelId}/support-documents?nationality=${nationality}`
    ).pipe(
      map((res) => {
        // modified the result for no content (for the wrong nationality)
        return res
          ? res
          : {
              documentList: [],
              verifyAllDocuments: false,
              invalidNationality: true,
            };
      })
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
        code: 'INVALID_FORM',
        msg: 'Invalid form. Please fill all the fields.',
      });
    }

    let documentFormValue = documentForm.getRawValue();

    documentFormValue.documentDetail.guests.forEach((guest, index) => {
      if (!guest.Optional) {
        let guestDocuments = guest.documents;
        if (!guestDocuments.length) {
          status.push({
            validity: false,
            msg: 'Please upload documents for guests.',
            code: 'UPLOAD_GUEST_DOCUMENT_PENDING',
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
                  code: 'UPLOAD_FRONT_DOCUMENT_PENDING',
                  type: document.documentType,
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
                  code: 'UPLOAD_BACK_DOCUMENT_PENDING',
                  type: document.documentType,
                  data: {
                    guestId: guest.id,
                    index,
                  },
                });
              }
            }

            if (guest.isInternational) {
              if (document.documentType === 'PASSPORT') {
                if (isEmpty(document.documentFileFront.trim())) {
                  status.push({
                    validity: false,
                    msg: `Please upload front document for ${document.documentType}.`,
                    code: 'UPLOAD_FRONT_DOCUMENT_PENDING',
                    type: document.documentType,
                    data: {
                      guestId: guest.id,
                      index,
                    },
                  });
                }
              }

              if (document.documentType === 'VISA' && journey === 'CHECKIN') {
                if (isEmpty(document.documentFileFront.trim())) {
                  status.push({
                    validity: false,
                    msg: `Please upload front document for ${document.documentType}.`,
                    code: 'UPLOAD_FRONT_DOCUMENT_PENDING',
                    type: document.documentType,
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
      }
    });

    return status;
  }

  get documentDetailDS() {
    return this._documnentDetailDS;
  }
}
