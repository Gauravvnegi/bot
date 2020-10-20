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
import { Clipboard } from '@angular/cdk/clipboard';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';

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
  self;
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
    private _snackBarService: SnackBarService,
    private _clipboard: Clipboard,
    public feedbackService: FeedbackService
  ) {
    this.self = this;
    this.initDetailsForm();
  }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  ngOnChanges() {}

  getReservationDetails() {
    //'b1d717f5-36ad-470d-8a0b-48e87b53220a' ||
    this._reservationService.getReservationDetails(this.bookingId).subscribe(
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

  verifyAllDocuments() {
    if (
      this.detailsForm.get('documentStatus').get('status').value == 'COMPLETED'
    ) {
      this._snackBarService.openSnackBarAsText(
        'Documents are already verified.',
        '',
        { panelClass: 'success' }
      );
      return;
    }

    this.documentDetailComponent.updateDocumentVerificationStatus(
      'ACCEPT',
      true
    );
  }

  activateAndgenerateJourney(journeyName) {
    if (!journeyName) {
      console.error('Please provide journey');
      return;
    }

    this._reservationService
      .generateJourneyLink(
        this.reservationDetailsFG.get('bookingId').value,
        journeyName
      )
      .subscribe(
        (res) => {
          this._clipboard.copy(`${res.domain}?token=${res.journey.token}`);
          this._snackBarService.openSnackBarAsText(
            'Link copied successfully',
            '',
            {
              panelClass: 'success',
            }
          );
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  generateCheckinLink() {}

  acceptPayment(status = 'Accept') {
    let data = {
      stepName: 'PAYMENT',
      state: status,
      remarks: '',
    };

    this._reservationService
      .updateStepStatus(this.reservationDetailsFG.get('bookingId').value, data)
      .subscribe(
        (res) => {
          this._snackBarService.openSnackBarAsText('Payment accepted', '', {
            panelClass: 'success',
          });
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  downloadInvoice() {
    this._reservationService
      .downloadInvoice(this.reservationDetailsFG.get('bookingId').value)
      .subscribe(
        (data) => {},
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  confirmAndNotifyCheckin() {
    let data = {
      journey: 'CHECKIN',
      state: status,
      remarks: '',
    };

    this._reservationService
      .updateJourneyStatus(
        this.reservationDetailsFG.get('bookingId').value,
        data
      )
      .subscribe(
        (res) => {
          this._snackBarService.openSnackBarAsText('Checkin completed', '', {
            panelClass: 'success',
          });
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
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

// CLIENT
// Activate & Generate Checkin Link

// HEALTH - documentStatus (Checkin )
// checkin -- if within a window -- time -- before -- popup for early checkin - params(remarks -- admin user-id), 2 api calls for early checkin
// checkin -- if within a window -- time -- after -- popup for late checkin -- api call with admin user id

// checkout
// Prepare invoice - when i have to do checkout , (and chnage it to send-invoice)

// Activate & Generate Checkout Link
// dependency -- checkin complete & (start end end in betweeen) and prepare invoice done
// if (checkout -- pending)
// checkout -- if within a window -- time -- before -- popup for early checkout - params(remarks -- admin user-id), 2 api calls for early checkout
// checkout -- if within a window -- time -- after -- popup for late checkout -- api call with admin user id

// Manual (Precheckin- Inactive)
// Add deposit rule
// send Ativate and Generate pre- checkinn link -- enable when precheckin window or when add deposit rule is done

// states-
// Precheckin
// Activate and Generate
