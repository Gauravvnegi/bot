import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-admin-guest-details',
  templateUrl: './admin-guest-details.component.html',
  styleUrls: ['./admin-guest-details.component.scss']
})
export class AdminGuestDetailsComponent implements OnInit {

  @Input() guestDetails;
  @Input() parentForm;

  primaryGuest;
  isActionEdit:boolean;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _snackBarService: SnackBarService
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
      remark:[''],
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
      isInternational:[''],
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
  }

  editHealthStatus(){
    this.isActionEdit = true;
  }

  updateHealthDeclarationStatus(status){
    let data = {
      stepName : "HEALTHDECLARATION",
      state: status,
      remarks: this.guestDetailsForm.get('remark').value
    };
    this._reservationService.updateStepStatus('17b322c3-fa52-4e3d-9883-34132f6954cd',data)
    .subscribe(response =>{
      this.healDeclarationForm.get('isAccepted').setValue(status === 'ACCEPT'?'COMPLETED':'FAILED');
      this.isActionEdit = false;
      this._snackBarService.openSnackBarAsText(
        'Status updated sucessfully.',
        '',
        { panelClass: 'success' }
      );
    },
    (error)=>{
      this._snackBarService.openSnackBarAsText(error.error.message);
    })
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
