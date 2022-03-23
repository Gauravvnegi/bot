import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AdminDetailsService } from '../../services/admin-details.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'hospitality-bot-admin-documents-details',
  templateUrl: './admin-documents-details.component.html',
  styleUrls: ['./admin-documents-details.component.scss'],
})
export class AdminDocumentsDetailsComponent implements OnInit {
  //disableDocumentType = false;
  selectedGuestGroup;
  selectedGuestId;
  documentsList;
  countriesLOV;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg'],
  };

  @Input() parentForm;
  @Input('data') detailsData;
  @Output() addFGEvent = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminDetailsService: AdminDetailsService,
    private _snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    //this.listenForGuestNationalityChange();
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

  // onNationalityChange(nationality) {
  //   this.documentsList = [];
  //   this.selectedGuestGroup.get('selectedDocumentType').setValue('');
  //   this.getDocumentsByCountry(nationality);
  // }

  listenForGuestNationalityChange() {
    // this._adminDetailsService.guestNationality.subscribe(response =>{
    //     if(response){
    //      this.setDocumentsIfInternational(this.documentsList);
    //     }else{
    //      this.setDocumentsIfNotInternational();
    //     }
    // });
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

  setDefaultGuestForDocument() {
    this.detailsData.guestDetails.guests.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
        this.onGuestChange(guest.id);
      }
    });
  }

  // setDocumentsIfInternational(documentList) {
  //   this.selectedGuestGroup.get('documents').controls = [];
  //   this.disableDocumentType = true;
  //   let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
  //   documentList.forEach((documentType, index) => {
  //     documentFA.push(this.getDocumentFG());
  //     documentFA.at(index).get('documentType').patchValue(documentType);
  //   });
  //   let documentDetails = this.getGuestDocumentsValue(this.selectedGuestId);
  //   if (documentDetails) {
  //     documentFA.patchValue(documentDetails && documentDetails);
  //   }
  // }

  // setDocumentsIfNotInternational() {
  //   this.selectedGuestGroup.get('documents').controls = [];
  //   this.disableDocumentType = false;
  //   if (this.selectedGuestGroup.get('selectedDocumentType').value) {
  //     let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
  //     documentFA.push(this.getDocumentFG());
  //     let documentDetails = this.getGuestDocumentsValue(this.selectedGuestId);
  //     if (documentDetails) {
  //       documentFA.patchValue(documentDetails && documentDetails);
  //     }
  //   }
  // }

  // onSelectedDocumentTypeChange(documentType) {
  //   this.selectedGuestGroup.get('documents').controls = [];
  //   let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
  //   documentFA.push(this.getDocumentFG());
  //   documentFA.at(0).get('documentType').patchValue(documentType);
  // }

  addDocuments() {
    if (this.guestsFA.controls.length > 0) {
      this.guestsFA.controls.forEach((guestFG: FormGroup, index) => {
        guestFG.addControl('documents', new FormArray([]));
        let controlFA = guestFG.get('documents') as FormArray;
        //improper check ? what if i manipulate the guest index
        this.detailsData.guestDetails.guests[index].documents.forEach((doc) => {
          controlFA.push(this.getDocumentFG());
        });
      });
      this.patchGuestData();
    }
  }

  // getGuestDocumentsValue(guestId) {
  //   let guest = this.detailsData.guestDetails.find(
  //     (guest) => guest.id === guestId
  //   );
  //   if (
  //     guest.nationality === this.selectedGuestGroup.get('nationality').value &&
  //     guest.selectedDocumentType ===
  //       this.selectedGuestGroup.get('selectedDocumentType').value
  //   ) {
  //     return guest.documents;
  //   }
  // }

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
    });
  }

  updateDocumentVerificationStatus(status, isConfirmALL = false) {
    if (status == 'REJECT' && !this.selectedGuestGroup.get('remarks').value) {
      this._snackBarService.openSnackBarAsText('Please enter remarks');
      return;
    }

    let data = this.mapDocumentVerificationData(status, isConfirmALL);

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
          this._snackBarService.openSnackBarAsText(
            'Status updated sucessfully.',
            '',
            { panelClass: 'success' }
          );
          isConfirmALL
            ? this.updateAllDocumentsStatus()
            : this.checkIfAllDocumentsVerified();
        },
        (error) => {
          this._snackBarService.openSnackBarAsText(error.error.message);
          // this.selectedGuestGroup.get('status').setValue(status === 'ACCEPT'?'COMPLETED':'FAILED');
          // isConfirmALL? this.updateAllDocumentsStatus(): this.checkIfAllDocumentsVerified();
        }
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
    let urls = [];
    let fileNames = [];
    const guest = this.detailsData.guestDetails.guests.filter(
      (data) => data.id === this.selectedGuestId
    )[0];
    const name = `${guest.firstName}_${guest.lastName}`;
    documents.forEach((doc) => {
      urls.push(doc.frontUrl);
      fileNames.push(`${name}_${doc.documentType}_frontURL`);
      if (doc.documentType != 'VISA') {
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
          this._snackBarService.openSnackBarAsText(err);
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
