import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { ImageHandlingComponent } from 'libs/admin/shared/src/lib/components/image-handling/image-handling.component';
import { ReservationService } from '../../services/reservation.service';

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

  @Input() parentForm;
  @Input('data') detailsData;
  @Output() addFGEvent = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.getCountriesList();
    this.addDocumentStatusForm();
    this.setDefaultGuestForDocument();
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
      .getDocumentsByNationality(
        this.detailsData.reservationDetails.hotelId,
        nationality
      )
      .subscribe((response) => {
        this.documentsList = response.documentList;
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
    const data = this.guestsFA.controls.reduce(
      (prev, curr) => {
        const currValue = curr.value;

        // -- TODO (Mapping value from control as value is not updating)
        const currentDocuments = (curr.get(
          'documents'
        ) as FormArray).controls.map((element) => ({
          frontUrl: element.get('frontUrl').value,
          backUrl: element.get('backUrl').value,
          documentType: element.get('documentType').value,
        }));

        if (currValue.isPrimary) {
          prev.primaryGuest['id'] = currValue.id;
          prev.primaryGuest['documents'] = currentDocuments;
        } else {
          prev.sharerGuests.push({
            id: currValue.id,
            documents: currentDocuments,
          });
        }
        return prev;
      },
      {
        primaryGuest: {},
        sharerGuests: [],
      }
    );

    this._reservationService
      .saveDocument(this.detailsData.reservationDetails.bookingId, data)
      .subscribe((_res) => {
        this.snackbarService.openSnackBarAsText(
          'Document updated successfully',
          '',
          { panelClass: 'success' }
        );
      });
  }

  uploadDocuments(data, docPage: 'front' | 'back', index: number) {
    const docPageControl = this.documentFormGroup
      .at(index)
      .get(`${docPage}Url`);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'image-cropper-modal';

    const dialogRef = this.modalService.openDialog(
      ImageHandlingComponent,
      dialogConfig
    );

    dialogRef.componentInstance.imageChangedEvent = {
      target: {
        files: [data.file],
      },
    };

    dialogRef.componentInstance.onModalClose.subscribe((response) => {
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

        this._reservationService
          .uploadDocumentFile(
            this.detailsData.reservationDetails.bookingId,
            this.selectedGuestGroup.get('id').value,
            formData
          )
          .subscribe(
            (res) => {
              docPageControl.setValue(res.fileDownloadUrl);
              this.uploadingDoc = '';
            },
            ({ error }) => {
              this.snackbarService.openSnackBarAsText(error?.message);
              this.uploadingDoc = '';
            }
          );
      }
      dialogRef.close();
    });
  }

  updateDocumentVerificationStatus(status, isConfirmALL = false) {
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
    this.guestsFA.controls.forEach((guest) => {
      if (guest.get('status').value !== 'COMPLETED') {
        if (guest.get('status').value === 'FAILED') {
          this.documentStatus.get('status').patchValue('FAILED');
        } else {
          this.documentStatus.get('status').patchValue('INITIATED');
        }
      } else {
        this.documentStatus.get('status').setValue('COMPLETED');
      }
    });
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
  }

  onGuestChange(value: string) {
    this.guestsFA.controls.forEach((guest: FormGroup) => {
      if (guest.get('id').value === value) {
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

  onDocumentTypeChange = (res: string) => {
    if (!res) return;

    this.documentFormGroup.clear();
    const guestId = this.selectedGuestGroup.get('id').value;

    const guestData = this.detailsData.guestDetails.guests.find(
      (data) => data.id === guestId
    );

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

      this.documentFormGroup.controls.push(
        this.getDocumentFG(
          { documentType: docTypes[0], ...getDocs(0) },
          this.getDocumentsConfigurationSettings(!isNational, docTypes[0])
        )
      );

      this.documentFormGroup.controls.push(
        this.getDocumentFG(
          { documentType: docTypes[1], ...getDocs(1) },
          this.getDocumentsConfigurationSettings(!isNational, docTypes[1])
        )
      );
    }
  };

  downloadDocs(documents) {
    const urls = [];
    const fileNames = [];
    const guest = this.detailsData.guestDetails.guests.filter(
      (data) => data.id === this.selectedGuestId
    )[0];
    const name = `${guest.firstName}_${guest.lastName}`;
    documents.forEach((doc) => {
      urls.push(doc.frontUrl);
      fileNames.push(`${name}_${doc.documentType}_frontURL`);
      if (doc.documentType !== 'VISA') {
        urls.push(doc.backUrl);
        fileNames.push(`${name}_${doc.documentType}_backURL`);
      }
    });
    const zipFile = new JSZip();
    let count = 0;
    urls.forEach((url, i) => {
      let fileName = urls[i];
      const index = fileName.lastIndexOf('/');
      fileName = fileName.slice(index + 1);
      fileName = decodeURIComponent(fileName);
      fileName = `${fileNames[i]}_${fileName}`;
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          this.snackbarService.openSnackBarAsText(err);
          throw err;
        }
        zipFile.file(fileName, data, { binary: true });
        count++;
        if (count === urls.length) {
          zipFile.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `${guest.firstName}_${guest.lastName}.zip`);
          });
        }
      });
    });
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
