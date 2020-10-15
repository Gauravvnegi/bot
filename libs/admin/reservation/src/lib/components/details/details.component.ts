import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AdminGuestDetailsComponent } from '../admin-guest-details/admin-guest-details.component';
import { AdminDetailsService } from '../../services/admin-details.service';
import { AdminDocumentsDetailsComponent } from '../admin-documents-details/admin-documents-details.component';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnChanges {
  // @ViewChild(AdminGuestDetailsComponent)
  // guestDetailComponent: AdminGuestDetailsComponent;
  @ViewChild('adminDocumentsDetailsComponent')
  documentDetailComponent: AdminDocumentsDetailsComponent;

  detailsForm: FormGroup;
  details;
  isGuestInfoPatched: boolean = false;
  primaryGuest;
  isReservationDetailFetched: boolean = false;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];
  @Input() bookingId;
  @Output() onDetailsClose = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminDetailsService: AdminDetailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBarService: SnackBarService
  ) {
    this.initDetailsForm();
  }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  ngOnChanges() {}

  getReservationDetails() {
    this._reservationService
      .getReservationDetails(
        this.bookingId || 'fd90295a-7789-46a2-9b59-8a193009baf6'
      )
      .subscribe(
        (response) => {
          this.details = new Details().deserialize(response);
          this.mapValuesInForm();
          this.isReservationDetailFetched = true;
        },
        (error) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  initDetailsForm() {
    this.detailsForm = this._fb.group({
      stayDetails: this._fb.group({}),
      guestInfoDetails: this._fb.group({}),
      documentDetails: this._fb.group({}),
      packageDetails: this._fb.group({}),
      paymentDetails: this._fb.group({}),
      activityDetails: this._fb.group({}),
      regCardDetails: this._fb.group({
        status: [''],
        url: [''],
      }),
      healthCardDetails: this._fb.group({}),
      reservationDetails: this._fb.group({
        bookingNumber: [''],
        bookingId: [''],
      }),
    });
  }

  addFGEvent(data) {
    this.detailsForm.setControl(data.name, data.value);
  }

  guestInfoPatched(data: boolean) {
    if (data) {
      const guestFA = this.detailsForm
        .get('guestInfoDetails')
        .get('guests') as FormArray;
      guestFA.controls.forEach((guestFG) => {
        if (guestFG.get('isPrimary').value === true) {
          this.primaryGuest = guestFG.value;
        }
      });
      this.isGuestInfoPatched = true;
      this._changeDetectorRef.detectChanges();
    }
  }

  // confirmAllHealthDocs() {
  //   if (this.healthCardDetailsFG.get('status').value == 'INITIATED') {
  //     this._snackBarService.openSnackBarAsText(
  //       'Please verify health declaration first'
  //     );
  //   }
  // }

  mapValuesInForm() {
    this.reservationDetailsFG.patchValue(this.details.reservationDetails);
    this.regCardDetailsFG.patchValue(this.details.regCardDetails);
    //  this.setStepsStatus();
  }

  // setStepsStatus() {
  //   this._adminDetailsService.healthDeclarationStatus = this.healDeclarationForm.get(
  //     'isAccepted'
  //   ).value;
  // }

  // confirmHealthDocs(status) {
  //   this.guestDetailComponent.updateHealthDeclarationStatus(status);
  // }

  verifyAllDocuments(status) {
    this.documentDetailComponent.updateDocumentVerificationStatus(status, true);
  }

  getPrimaryGuestDetails() {
    this.details.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.primaryGuest = guest;
        return;
      }
    });
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  get reservationDetailsFG() {
    return this.detailsForm.get('reservationDetails') as FormGroup;
  }

  get stayDetailsFG() {
    return this.detailsForm.get('stayDetails') as FormGroup;
  }

  get guestInfoDetailsFG() {
    return this.detailsForm.get('guestInfoDetails') as FormGroup;
  }

  get healthCardDetailsFG() {
    return this.detailsForm.get('healthCardDetails') as FormGroup;
  }

  get regCardDetailsFG() {
    return this.detailsForm.get('regCardDetails') as FormGroup;
  }

  get documentStatusFG() {
    return this.detailsForm.get('documentStatus') as FormGroup;
  }
}
