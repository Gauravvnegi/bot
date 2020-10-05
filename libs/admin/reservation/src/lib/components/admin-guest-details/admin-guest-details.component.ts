import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-admin-guest-details',
  templateUrl: './admin-guest-details.component.html',
  styleUrls: ['./admin-guest-details.component.scss']
})
export class AdminGuestDetailsComponent implements OnInit {

  @Input() guestDetails;
  @Input() parentForm;

  @Output() guest = new EventEmitter();

  primaryGuest;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.addFormsControls();
  }

  addFormsControls(){
    this.parentForm.addControl('guestDetails', this.initGuestDetailForm());
    this.addGuests(this.guestDetails);
  }

  initGuestDetailForm() {
    return this._fb.group({
    });
  }

  getGuestFG(): FormGroup {
    return this._fb.group({
      id: [''],
      title: [''],
      firstName: [''],
      lastName: [''],
      countryCode: [''],
      phoneNumber: [''],
      email: [''],
      isPrimary: [''],
      nationality:[''],
      selectedDocumentType:[''],
      verificationStatus: [''],
      remark:['']
    });
  }

  addGuests(guestDetail) {
    this.guestDetailsForm.addControl('guests', new FormArray([]));
    guestDetail.guestDetails.forEach((guest) => {
      let controlFA = this.guestDetailsForm.get('guests') as FormArray;
      controlFA.push(this.getGuestFG());
    });

    this.mapValuesInForm();
    this.extractPrimaryDetails();
  }

  mapValuesInForm() {
    this.guests.patchValue(this.guestDetails.guestDetails);
  }

  extractPrimaryDetails() {
    this.guests.controls.forEach((guestFG) => {
      if (guestFG.get('isPrimary').value === true) {
        this.primaryGuest = guestFG;
      }
    });
    this.guest.emit(this.primaryGuest);
  }

  setHealthDeclaration(status){
    // call Api to set status of the health form
    // On success , change the form value
    this.healDeclarationForm.get('isAccepted').setValue(status);
  }

  get guests(): FormArray {
    return this.guestDetailsForm.get('guests') as FormArray;
  }

  get guestDetailsForm(){
    return this.parentForm.get('guestDetails')as FormGroup;
  }

  get stayDetailsForm(){
    return this.parentForm.get('stayDetails')as FormGroup;
  }

  get healDeclarationForm(){
    return this.parentForm.get('healthDeclareForm') as FormGroup;
  }

}
