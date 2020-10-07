import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AdminDetailsService } from '../../services/admin-details.service';

@Component({
  selector: 'hospitality-bot-admin-documents-details',
  templateUrl: './admin-documents-details.component.html',
  styleUrls: ['./admin-documents-details.component.scss']
})
export class AdminDocumentsDetailsComponent implements OnInit {

  disableDocumentType = false;
  selectedGuestGroup;
  selectedGuestId;
  //isSelectedGuestInternational:boolean;
  documentsList;
  countries;
  fileUploadData = {
    fileSize : 3145728,
    fileType : ['png', 'jpg']
  }
 
  @Input() guestDetails;
  @Input() parentForm;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminDetailsService: AdminDetailsService
  ) { }

  ngOnInit(): void {
    this.listenForGuestNationalityChange();
    this.getCountriesList();
    this.addDocumentStatusForm();
    this.setDefaultGuestForDocument();
    this.addDocuments();
  }

  addDocumentStatusForm(){
    this.parentForm.addControl('documentStatus',this.initDocumentStatus());
    this.documentStatus.patchValue(this.guestDetails.documentStatus);
  }

  initDocumentStatus(){
    return this._fb.group({
      status:['']
    });
  }

  getCountriesList() {
    this._reservationService.getCountryList().subscribe((countriesList) => {
      this.countries = countriesList.map((country) => {
        return {
          key: country.nationality,
          value: country.name,
          id: country.id,
          nationality: country.nationality,
        };
      });
    });
    console.log(this.parentForm);
      console.log(this.guestDetails);
  }

  onNationalityChange(nationality){
    this.documentsList =[];
    this.selectedGuestGroup.get('selectedDocumentType').setValue('');
    this.getDocumentsByCountry(nationality);
  }

  listenForGuestNationalityChange(){
    this._adminDetailsService.guestNationality.subscribe(response =>{
        if(response){
         this.setDocumentsIfInternational(this.documentsList);
        }else{
         this.setDocumentsIfNotInternational();
        }
    });
  }

  getDocumentsByCountry(nationality){
    this._reservationService.getDocumentsByNationality(this.guestDetails.reservationDetails.hotelId, nationality)
    .subscribe(response =>{
      this.documentsList = response.documentList;
      this._adminDetailsService.guestNationality = response.verifyAllDocuments;
    })
  }

  setDefaultGuestForDocument() {
    this.guestDetails.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
      }
      this.onGuestChange(guest.id);
    });
  }

  setDocumentsIfInternational(documentList){
    this.selectedGuestGroup.get('documents').controls = [];
    this.disableDocumentType = true;
    let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
    documentList.forEach((documentType, index) => {
      documentFA.push(this.getDocumentFG());
      documentFA.at(index).get('documentType').patchValue(documentType);
    });
    let documentDetails = this.getGuestDocumentsValue(this.selectedGuestId);
    if(documentDetails){
      documentFA.patchValue(documentDetails && documentDetails);
    }
  }

  setDocumentsIfNotInternational(){
    this.selectedGuestGroup.get('documents').controls = [];
    this.disableDocumentType = false;
    if(this.selectedGuestGroup.get('selectedDocumentType').value){
      let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
      documentFA.push(this.getDocumentFG());
      let documentDetails = this.getGuestDocumentsValue(this.selectedGuestId);
      if(documentDetails){
        documentFA.patchValue(documentDetails && documentDetails);
      }
    }
  }

  onSelectedDocumentTypeChange(documentType){
    this.selectedGuestGroup.get('documents').controls = [];
    let documentFA = this.selectedGuestGroup.get('documents') as FormArray;
    documentFA.push(this.getDocumentFG());
    documentFA.at(0).get('documentType').patchValue(documentType);
  }

  addDocuments() {
    if(this.guests.controls.length > 0){
      this.guests.controls.forEach((element: FormGroup, index) => {
        element.addControl('documents', new FormArray([]));
      });
    }
  }

  getGuestDocumentsValue(guestId){
    let guest = this.guestDetails.guestDetails.find(guest => guest.id === guestId);
    if(guest.nationality === this.selectedGuestGroup.get('nationality').value && guest.selectedDocumentType === this.selectedGuestGroup.get('selectedDocumentType').value){
      return guest.documents;
    }
  }

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: ['']
    });
  }

  changeVerificationStatus(status){

  }

  onGuestChange(value) {
    this.guests.controls.forEach((guest) => {
      if (guest.get('id').value === value) {
        this.selectedGuestId = value;
        this.selectedGuestGroup = guest;
        this.documentsList = [];
        // let nationality = (this.guestDetails.guestDetails.find(guest => this.selectedGuestId === guest.id)).nationality;
        // this.selectedGuestGroup.get('nationality').patchValue(nationality);
        // this.getDocumentsByCountry(nationality);
        this.getDocumentsByCountry(this.selectedGuestGroup.get('nationality').value);
      }
    });
  }

  uploadFile(fileData){
    let formData = new FormData();
     formData.append('file', fileData.file);
     formData.append('doc_type', fileData.documentType);
     formData.append('doc_page', fileData.pageType);

     this._reservationService.uploadDocumentFile('17b322c3-fa52-4e3d-9883-34132f6954cd',this.selectedGuestGroup.get('id').value, formData)
     .subscribe(response =>{
     })
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  get guestDetailsForm(){
    return this.parentForm.get('guestDetails')as FormGroup;
  }

  get documentStatus(){
    return this.parentForm.get('documentStatus') as FormGroup;
  }

}
