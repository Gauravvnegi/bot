import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';

import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DownloadService,
  Option,
  openModal,
} from '@hospitality-bot/admin/shared';
import { ImageHandlingComponent } from 'libs/admin/shared/src/lib/components/image-handling/image-handling.component';
import {
  DocumentDetailsConfig,
  GuestDetailsConfig,
} from 'libs/admin/shared/src/lib/models/detailsConfig.model';
import { ReservationService } from '../../services/reservation.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-admin-documents-details',
  templateUrl: './admin-documents-details.component.html',
  styleUrls: ['./admin-documents-details.component.scss'],
})
export class AdminDocumentsDetailsComponent implements OnInit {
  // selectedGuestGroup: AbstractControl;
  selectedGuestId;
  documentsList;
  countriesLOV;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg', 'jpeg', 'pdf'],
  };
  uploadingDoc: string; //'front-1'|'front-2'|'back-1'|'back-2'
  updatedDocGuest = [];
  isAllDocsAttached: boolean = false;

  // Options List
  guestOptions: Option[];
  docTypeOptions: Option[];

  entityId: string;

  @Input() parentForm;
  @Input('data') detailsData;
  @Output() addFGEvent = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private downloadService: DownloadService,
    private dialogService: DialogService
  ) {
    this.entityId = this.globalFilterService.entityId;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initOptions();
  }

  ngOnChanges() {
    this.getCountriesList();
    this.addDocumentStatusForm();
    this.setDefaultGuestForDocument();
  }

  initOptions() {
    this.guestOptions = this.detailsData.guestDetails.guests.map(
      (guest) =>
        ({
          label: guest.firstName
            ? `${guest.title} ${guest.firstName} ${guest.lastName}`
            : `Add ${guest.label} details`,
          value: guest.id,
          disabled: !guest.firstName,
        } as Option)
    );
  }

  addDocumentStatusForm() {
    this.addFGEvent.next({
      name: 'documentStatus',
      value: this.initDocumentStatus(),
    });
    this.documentStatus
      .get('status')
      .patchValue(this.detailsData.stepStatusDetails.documents);
  }

  initDocumentStatus() {
    return this._fb.group({
      status: [''],
    });
  }

  getDocumentsData(): DocumentDS {
    const curr = this.guestsFA.controls.find(
      (item) => item.value.id === this.selectedGuestId
    );

    const currValue = curr.value;
    let isInvalid = false;
    // -- TODO (Mapping value from control as value is not updating)
    const currentDocuments = (curr.get('documents') as FormArray).controls.map(
      (element) => {
        const frontUrl = element.get('frontUrl').value;
        const backUrl = element.get('backUrl').value;

        const settings = element.get('settings')
          .value as DocumentForm['settings'];

        if (!isInvalid) {
          isInvalid =
            (settings.backImage === 'required' && !backUrl) ||
            (settings.frontImage === 'required' && !frontUrl);
        }

        return {
          frontUrl,
          backUrl,
          documentType: element.get('documentType').value,
        };
      }
    );

    return {
      data: currentDocuments,
      guestId: currValue.id,
      isPrimary: currValue.isPrimary,
      isInvalid,
    } as DocumentDS;
  }

  getCountriesList() {
    this._reservationService.getCountryList().subscribe((countriesList) => {
      this.countriesLOV = countriesList.map((country) => {
        return {
          label: country.name,
          value: country.nationality,
          id: country.id,
          nationality: country.nationality,
        };
      });
    });
  }

  getDocumentsConfigurationSettings(
    isInternational: boolean,
    docType: ForeignNationalDocType | string
  ): DocumentForm['settings'] {
    const isVISA = docType === ForeignNationalDocType.VISA;
    const isPASSPORT = docType === ForeignNationalDocType.PASSPORT;

    const settings: DocumentForm['settings'] = {
      frontImage: 'required',
      backImage: isInternational
        ? isPASSPORT
          ? 'not-required'
          : isVISA
          ? 'optional'
          : 'required'
        : 'required',
      frontImageName: `${docType} FRONT PAGE`,
      backImageName: isVISA
        ? 'VISA ARRIVAL STAMP PAGE'
        : `${docType} BACK PAGE`,
    };

    return settings;
  }

  /**
   * Patching Guest details
   */
  setDefaultGuestForDocument() {
    this.guestsFA.controls.forEach((guestFG: FormGroup, index) => {
      const guestData = this.detailsData.guestDetails.guests[index];
      guestFG.addControl('documents', new FormArray([])); // Adding document control for each guest

      /**
       * Adding document FG to the documents CONTROL - If guest already has documents
       */
      if (!!guestData.documents?.length) {
        guestData.documents.forEach((item) => {
          /**
           * Settings for which documents are required based of document type and nationality
           */
          const settings = this.getDocumentsConfigurationSettings(
            guestData.isInternational,
            item.documentType
          );

          (guestFG.get('documents') as FormArray).controls.push(
            this.getDocumentFG(item, settings)
          );
        });
      }
    });

    /** Patching the details data to form */
    this.guestsFA.patchValue(this.detailsData.guestDetails.guests);

    this.detailsData.guestDetails.guests.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
        this.onGuestChange(guest.id);
      }
    });
  }

  getDocumentsByCountry(nationality) {
    this._reservationService
      .getDocumentsByNationality(this.entityId, nationality)
      .subscribe((response) => {
        this.documentsList = response.documentList;
        this.docTypeOptions = this.documentsList.map((item) => ({
          label: item,
          value: item,
        }));

        /**
         * Patching the document type - Logic
         */
        const guestData: GuestDetailsConfig = this.getGuestDataById(
          this.selectedGuestId
        );

        const selectedNationality = this.selectedGuestGroup.get('nationality')
          .value;
        const currentGuestNationality = guestData?.nationality;
        const currentGuestDocument = guestData?.selectedDocumentType;

        const currentDocIdx =
          this.documentsList?.findIndex(
            (item) =>
              this.selectedGuestGroup.get('selectedDocumentType').value === item
          ) ?? -1;

        const selectedDoc =
          currentGuestDocument &&
          selectedNationality === currentGuestNationality
            ? currentGuestDocument
            : this.documentsList[currentDocIdx === -1 ? 0 : currentDocIdx];

        this.selectedGuestGroup
          .get('selectedDocumentType')
          .patchValue(selectedDoc);

        //--------- Patching logic completed

        // this._adminDetailsService.guestNationality = response.verifyAllDocuments;
      });
  }

  /**
   * To get the document form group
   * @param docValues these value will be patched to the create FG
   * @param settings additional setting to be added or overridden
   * @returns Document Form Group
   */
  getDocumentFG(
    docValues: Partial<Omit<DocumentForm, 'settings'>> = {},
    settings: Partial<DocumentForm['settings']> = {}
  ): FormGroup {
    const defaultSettings: DocumentForm['settings'] = {
      frontImage: 'required',
      backImage: 'required',
    };

    const formGroup = this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
      settings: {
        ...defaultSettings,
        ...settings,
      },
    });

    formGroup.patchValue(docValues);
    return formGroup;
  }

  saveDocument() {
    if (!this.updatedDocGuest.includes(this.selectedGuestId)) {
      return;
    }

    const docsData = this.getDocumentsData();

    let data = this.detailsData.guestDetails.guests.reduce((prev, curr) => {
      const guestDocData = { documents: curr.documents, id: curr.id };
      if (curr.isPrimary) {
        prev['primaryGuest'] = guestDocData;
      } else {
        if (prev['sharerGuests']) {
          prev['sharerGuests'].push(guestDocData);
        } else {
          prev['sharerGuests'] = [guestDocData];
        }
      }
      return prev;
    }, {});

    if (docsData.isInvalid) {
      this.snackbarService.openSnackBarAsText('Please attach all documents');
      return;
    }

    this.isAllDocsAttached = true;

    if (docsData.isPrimary) {
      data.primaryGuest = {
        ...data.primaryGuest,
        documents: docsData.data,
      };
    } else {
      data.sharerGuests.forEach((item) => {
        if (item.id === docsData.guestId) {
          item.documents = docsData.data;
        }
      });
    }

    this._reservationService
      .saveDocument(this.detailsData.reservationDetails.bookingId, data)
      .subscribe((_res) => {
        // if (this.selectedGuestGroup.get('status').value !== 'COMPLETED')
        this.selectedGuestGroup.get('status').patchValue('INITIATED');
        this.updateDocumentVerificationStatus('ACCEPT');

        this.snackbarService.openSnackBarAsText(
          'Document updated successfully',
          '',
          { panelClass: 'success' }
        );

        this.updatedDocGuest = this.updatedDocGuest.filter(
          (item) => item !== this.selectedGuestId
        );

        /**
         * Resetting the variable
         */
        this.detailsData.guestDetails.guests.forEach(
          (data: GuestDetailsConfig) => {
            if (data.id === this.selectedGuestId) {
              if (data.documents.length === 0) {
                const dataConfig = new DocumentDetailsConfig().deserialize({
                  backUrl: '',
                  frontUrl: '',
                  documentType: '',
                  id: '',
                });
                data.documents.push(dataConfig);
              }
              data.documents[0].backUrl = docsData.data[0].backUrl;
              data.documents[0].frontUrl = docsData.data[0].frontUrl;
              data.documents[0].documentType = docsData.data[0].documentType;
              data.selectedDocumentType = docsData.data[0].documentType;
              data.nationality = this.selectedGuestGroup.get(
                'nationality'
              ).value;
            }
          }
        );
        const docForm = this.selectedGuestGroup.get('documents') as FormArray;
        docForm.at(0).get('backUrl').patchValue(docsData.data[0].backUrl);
        docForm.at(0).get('frontUrl').patchValue(docsData.data[0].frontUrl);
        docForm
          .at(0)
          .get('documentType')
          .patchValue(docsData.data[0].documentType);

        // Can be used to reset the guest data
        // this._reservationService.$reinitializeGuestDetails.next(true);
      });
  }

  uploadDocuments(data, docPage: 'front' | 'back', index: number) {
    const docPageControl = this.documentFormGroup
      .at(index)
      .get(`${docPage}Url`);

    const dialogData: Partial<ImageHandlingComponent> = {
      imageChangedEvent: {
        target: {
          files: [data.file],
        },
      },
    };

    const dialogRef = openModal({
      config: {
        width: 'unset',
        styleClass: 'image-cropper-modal',
        data: dialogData,
      },
      dialogService: this.dialogService,
      component: ImageHandlingComponent,
    });

    dialogRef.onClose.subscribe((response) => {
      if (response.status) {
        if (response.data.file.size > this.fileUploadData.fileSize) {
          this.snackbarService.openSnackBarAsText('File size limit exceeded');
          return;
        }

        const file = response.data.file;
        this.uploadingDoc = `${docPage}-${index}`;
        let formData = new FormData();
        formData.append('file', file);
        formData.append(
          'doc_type',
          this.documentFormGroup.at(index).get('documentType').value
        );

        formData.append('doc_page', docPage);
        formData.append(
          'doc_issue_place',
          this.selectedGuestGroup.get('nationality').value
        );

        const guestID = this.selectedGuestGroup.get('id').value;

        this._reservationService
          .uploadDocumentFile(
            this.detailsData.reservationDetails.bookingId,
            guestID,
            formData
          )
          .subscribe(
            (res) => {
              docPageControl.setValue(res.fileDownloadUrl);
              this.uploadingDoc = '';
              this.updatedDocGuest.push(guestID);
              this.saveDocument();
            },
            ({ error }) => {
              this.snackbarService.openSnackBarAsText(error?.message);
              this.uploadingDoc = '';
            }
          );
      }
    });

    // dialogRef.componentInstance.imageChangedEvent = {
    //   target: {
    //     files: [data.file],
    //   },
    // };

    // dialogRef.componentInstance.onModalClose.subscribe((response) => {
    //   if (response.status) {
    //     if (response.data.file.size > this.fileUploadData.fileSize) {
    //       this.snackbarService.openSnackBarAsText('File size limit exceeded');
    //       return;
    //     }

    //     const file = response.data.file;
    //     this.uploadingDoc = `${docPage}-${index}`;
    //     let formData = new FormData();
    //     formData.append('file', file);
    //     formData.append(
    //       'doc_type',
    //       this.documentFormGroup.at(index).get('documentType').value
    //     );

    //     formData.append('doc_page', docPage);
    //     formData.append(
    //       'doc_issue_place',
    //       this.selectedGuestGroup.get('nationality').value
    //     );

    //     const guestID = this.selectedGuestGroup.get('id').value;

    //     this._reservationService
    //       .uploadDocumentFile(
    //         this.detailsData.reservationDetails.bookingId,
    //         guestID,
    //         formData
    //       )
    //       .subscribe(
    //         (res) => {
    //           docPageControl.setValue(res.fileDownloadUrl);
    //           this.uploadingDoc = '';
    //           this.updatedDocGuest.push(guestID);
    //           this.saveDocument();
    //         },
    //         ({ error }) => {
    //           this.snackbarService.openSnackBarAsText(error?.message);
    //           this.uploadingDoc = '';
    //         }
    //       );
    //   }
    //   dialogRef.close();
    // });
  }

  isAllGuestDocsSubmitted() {
    const isSubmitted = this.guestsFA
      .getRawValue()
      .reduce(
        (
          value: boolean,
          item: { documents: DocumentForm[]; role: GuestRole } & Record<
            string,
            any
          >
        ) => {
          if (item.role === 'kids') {
            return value;
          }

          if (item.documents.length === 0) {
            return false;
          }

          let isSubmitted = true;
          const doc = item.documents[0];

          if (doc.settings.frontImage === 'required' && !doc.frontUrl) {
            isSubmitted = false;
          }

          if (doc.settings.backImage === 'required' && !doc.backUrl) {
            isSubmitted = false;
          }

          return isSubmitted && value;
        },
        true
      );

    return isSubmitted;
  }

  updateDocumentVerificationStatus(status, isConfirmALL = false) {
    if (isConfirmALL && !this.isAllGuestDocsSubmitted()) {
      this.snackbarService.openSnackBarAsText(
        'Please upload all guest documents prior to confirming.'
      );
      return;
    }

    if (status === 'REJECT' && !this.selectedGuestGroup.get('remarks').value) {
      this.snackbarService.openSnackBarAsText('Please enter remarks');
      return;
    }

    const data = this.mapDocumentVerificationData(status, isConfirmALL);

    this._reservationService
      .updateStepStatus(
        this.parentForm.get('reservationDetails').get('bookingId').value,
        data
      )
      .subscribe(
        (response) => {
          this.selectedGuestGroup
            .get('status')
            .setValue(status === 'ACCEPT' ? 'COMPLETED' : 'FAILED');
          this.snackbarService.openSnackBarAsText(
            'Status updated successfully.',
            '',
            { panelClass: 'success' }
          );
          isConfirmALL
            ? this.updateAllDocumentsStatus()
            : this.checkIfAllDocumentsVerified();
        },
        (error) => {}
      );
  }

  checkIfAllDocumentsVerified() {
    let isAllConfirmed = true;
    this.guestsFA.controls.forEach((guest) => {
      if (guest.get('status').value !== 'COMPLETED') {
        if (guest.get('status').value === 'FAILED') {
          this.documentStatus.get('status').patchValue('FAILED');
        } else {
          this.documentStatus.get('status').patchValue('INITIATED');
        }
        isAllConfirmed = false;
      } else {
        this.documentStatus.get('status').setValue('COMPLETED');
      }
    });

    if (isAllConfirmed) {
      this._reservationService.$allDocsAreConfirmed.next(true);
    }
  }

  mapDocumentVerificationData(status, isConfirmALL) {
    if (isConfirmALL) {
      return {
        stepName: 'DOCUMENTS',
        state: status,
        remarks: this.selectedGuestGroup.get('remarks').value,
      };
    } else {
      return {
        stepName: 'DOCUMENTS',
        state: status,
        remarks: this.selectedGuestGroup.get('remarks').value,
        guestId: this.selectedGuestGroup.get('id').value,
      };
    }
  }

  updateAllDocumentsStatus() {
    this.guestsFA.controls.forEach((guest) => {
      guest.get('status').patchValue('COMPLETED');
    });

    this.documentStatus.get('status').patchValue('COMPLETED');

    this._reservationService.$allDocsAreConfirmed.next(true);
  }

  onGuestChange(value: string) {
    this.guestsFA.controls.forEach((guest: FormGroup) => {
      if (guest.get('id').value === value) {
        // Resetting the value on guest change id docs not updated
        this.isAllDocsAttached = false;
        const previousGuestId = this.selectedGuestId;
        const prevGuest = this.guestsFA.controls.find(
          (item) => item.get('id').value === previousGuestId
        );
        const guestData: GuestDetailsConfig = this.getGuestDataById(
          this.selectedGuestId
        );
        prevGuest.get('nationality').patchValue(guestData.nationality);

        this.selectedGuestId = value;
        // this.selectedGuestGroup = guest;

        this.getDocumentsByCountry(
          this.selectedGuestGroup.get('nationality').value
        );
        this.selectedGuestGroup
          .get('nationality')
          .valueChanges.subscribe(this.onNationalityChange);
        this.selectedGuestGroup
          .get('selectedDocumentType')
          .valueChanges.subscribe(this.onDocumentTypeChange);
      }
    });
  }

  onNationalityChange = (res: string) => {
    this.getDocumentsByCountry(res);
    this.selectedGuestGroup.get('selectedDocumentType').reset();
    this.documentFormGroup.clear();
  };

  getGuestDataById(guestId: string) {
    return this.detailsData.guestDetails.guests.find(
      (data) => data.id === guestId
    );
  }

  onDocumentTypeChange = (res: string) => {
    if (!res) return;

    this.documentFormGroup.clear();
    const guestId = this.selectedGuestGroup.get('id').value;

    const guestData = this.getGuestDataById(guestId);

    const guestUploadedDocs = guestData.documents;
    const isDocTypeAlreadyPresent = guestData.selectedDocumentType === res;

    const getDocs = (idx: 0 | 1) => ({
      frontUrl: isDocTypeAlreadyPresent ? guestUploadedDocs[idx].frontUrl : '',
      backUrl: isDocTypeAlreadyPresent ? guestUploadedDocs[idx].backUrl : '',
    });

    const isNational =
      this.detailsData.reservationDetails.hotelNationality ===
      this.selectedGuestGroup.get('nationality').value;

    if (isNational) {
      this.documentFormGroup.controls.push(
        this.getDocumentFG(
          {
            documentType: res,
            ...getDocs(0),
          },
          this.getDocumentsConfigurationSettings(!isNational, res)
        )
      );
    } else {
      const docTypes = res.split('/') as ForeignNationalDocType[]; // ["PASSPORT","VISA"] or ["PASSPORT","OCI"]

      if (docTypes[0]) {
        this.documentFormGroup.controls.push(
          this.getDocumentFG(
            { documentType: docTypes[0], ...getDocs(0) },
            this.getDocumentsConfigurationSettings(!isNational, docTypes[0])
          )
        );
      }

      if (docTypes[1]) {
        this.documentFormGroup.controls.push(
          this.getDocumentFG(
            { documentType: docTypes[1], ...getDocs(1) },
            this.getDocumentsConfigurationSettings(!isNational, docTypes[1])
          )
        );
      }
    }
  };

  downloadDocs(documents) {
    const images = new Array<{ url: string; fileName: string }>();

    const guest = this.detailsData.guestDetails.guests.find(
      (data) => data.id === this.selectedGuestId
    );
    const name = `${guest.firstName}_${guest.lastName}`;

    const bookingNumber = this.detailsData.reservationDetails.bookingNumber;

    documents.forEach((doc) => {
      const frontUrl = doc.frontUrl?.trim();
      const backUrl = doc.backUrl?.trim();

      if (frontUrl) {
        images.push({
          url: frontUrl,
          fileName: `${doc.documentType}_${bookingNumber}_${name}_frontURL`,
        });
      }

      if (doc.documentType !== 'VISA' && backUrl) {
        images.push({
          url: doc.backUrl.trim(),
          fileName: `${doc.documentType}_${bookingNumber}_${name}_backURL`,
        });
      }
    });

    if (images.length) {
      this.downloadService.downloadFiles(images, 'image');
    } else {
      this.snackbarService.openSnackBarAsText('No files to download');
    }
  }

  get documentFormGroup(): FormArray {
    // return this.selectedGuestGroup.get('documents') as FormArray;
    return this.guestsFA.controls
      .find((item) => item.get('id').value === this.selectedGuestId)
      .get('documents') as FormArray;
  }

  get selectedGuestGroup(): AbstractControl {
    return this.guestsFA.controls.find(
      (item) => item.get('id').value === this.selectedGuestId
    );
  }

  get guestsFA(): FormArray {
    return this.parentForm.get('guestInfoDetails').get('guests') as FormArray;
  }

  get guestDetailsForm() {
    return this.parentForm.get('guestDetails') as FormGroup;
  }

  get documentStatus() {
    return this.parentForm.get('documentStatus') as FormGroup;
  }
}

type DocumentForm = {
  frontUrl: string;
  backUrl: string;
  documentType: string;
  id: string;
  settings: {
    backImage: 'required' | 'optional' | 'not-required';
    frontImage: 'required' | 'optional' | 'not-required';
    backImageName?: string;
    frontImageName?: string;
  };
};

enum ForeignNationalDocType {
  VISA = 'VISA',
  OCI = 'OCI',
  PASSPORT = 'PASSPORT',
}

type DocumentDS = {
  data: { frontUrl: string; backUrl: string; documentType: string }[];
  guestId: string;
  isInvalid?: boolean;
  isPrimary?: boolean;
};

type GuestRole = 'Primary Guest' | 'Sharer' | 'kids';
