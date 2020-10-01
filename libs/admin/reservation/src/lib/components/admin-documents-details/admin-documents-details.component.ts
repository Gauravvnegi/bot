import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-admin-documents-details',
  templateUrl: './admin-documents-details.component.html',
  styleUrls: ['./admin-documents-details.component.scss']
})
export class AdminDocumentsDetailsComponent implements OnInit {

  selectedGuestId;
  selectedGuestGroup;
  
  @Input() guestDetails;
  @Input() parentForm;

  constructor(
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setDefaultGuestForDocument();
    this.addDocuments();
  }

  setDefaultGuestForDocument() {
    this.guestDetails.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.selectedGuestId = guest.id;
      }
      this.onGuestChange(guest.id);
    });
  }

  addDocuments() {
    if(this.guests.controls.length > 0){
      this.guests.controls.forEach((element: FormGroup, index) => {
        element.addControl('documents', new FormArray([]));
        let controlFA = element.get('documents') as FormArray;
        this.guestDetails.guestDetails[index].documents.forEach(
          (doc) => {
            controlFA.push(this.getDocumentFG());
          }
        );
      });
      this.guests.patchValue(this.guestDetails.guestDetails);
    }
  }

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: [''],
      documentType: [''],
      frontUrl: [''],
      backUrl: [''],
      verificationStatus: [''],
      remark:['']
    });
  }

  onGuestChange(value) {
    this.guests.controls.forEach((guest) => {
      if (guest.get('id').value === value) {
        this.selectedGuestId = value;
        this.selectedGuestGroup = guest;
      }
    });
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  get guestDetailsForm(){
    return this.parentForm.get('guestDetails')as FormGroup;
  }

}
