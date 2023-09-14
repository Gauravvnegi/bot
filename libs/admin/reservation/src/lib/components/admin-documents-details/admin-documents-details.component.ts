import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ReservationService } from '../../services/reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-admin-documents-details',
  templateUrl: './admin-documents-details.component.html',
  styleUrls: ['./admin-documents-details.component.scss'],
})
export class AdminDocumentsDetailsComponent implements OnInit {
  selectedGuestGroup;
  selectedGuestId;
  documentsList;
  countriesLOV;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg'],
  };

  entityId: string;

  @Input() parentForm;
  @Input('data') detailsData;
  @Output() addFGEvent = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
  }

  ngOnChanges() {
    this.getLOV();
    this.addDocumentStatusForm();
  }

  getLOV() {
    this.getCountriesList();
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
      this.addDocuments();
      this.setDefaultGuestForDocument();
    });
  }

  patchGuestData() {
    this.guestsFA.patchValue(this.detailsData.guestDetails.guests);
  }

  getDocumentsByCountry(nationality) {
    this._reservationService
      .getDocumentsByNationality(this.entityId, nationality)
      .subscribe((response) => {
        this.documentsList = response.documentList;
        // this._adminDetailsService.guestNationality = response.verifyAllDocuments;
      });
  }

  setDefaultGuestForDocument() {
    this.detailsData.guestDetails.guests.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
        this.onGuestChange(guest.id);
      }
    });
  }

  addDocuments() {
    if (this.guestsFA.controls.length > 0) {
      this.guestsFA.controls.forEach((guestFG: FormGroup, index) => {
        guestFG.addControl('documents', new FormArray([]));
        const controlFA = guestFG.get('documents') as FormArray;
        this.detailsData.guestDetails.guests[index].documents.forEach((doc) => {
          controlFA.push(this.getDocumentFG());
        });
      });
      this.patchGuestData();
    }
  }

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
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
            'Status updated sucessfully.',
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

  onGuestChange(value) {
    this.guestsFA.controls.forEach((guest) => {
      if (guest.get('id').value === value) {
        this.selectedGuestId = value;
        this.selectedGuestGroup = guest;
        this.getDocumentsByCountry(
          this.selectedGuestGroup.get('nationality').value
        );
      }
    });
  }

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

    // Function to fetch and add files to the zip
    async function fetchAndAddFile(url, fileName) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${url}: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.arrayBuffer();
        zipFile.file(fileName, data);
        count++;

        if (count === urls.length) {
          const content = await zipFile.generateAsync({ type: 'blob' });
          saveAs(content, `${guest.firstName}_${guest.lastName}.zip`);
        }
      } catch (err) {
        this.snackbarService.openSnackBarAsText(err);
        console.error(err);
      }
    }

    // Fetch and add files
    urls.forEach((url, i) => {
      let fileName = urls[i];
      const index = fileName.lastIndexOf('/');
      fileName = fileName.slice(index + 1);
      fileName = decodeURIComponent(fileName);
      fileName = `${fileNames[i]}_${fileName}`;
      fetchAndAddFile(url, fileName);
    });
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
