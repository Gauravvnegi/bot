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
import {
  ShareIconConfig,
  Details,
} from '../../../../../shared/src/lib/models/detailsConfig.model';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NotificationComponent } from 'libs/admin/notification/src/lib/components/notification/notification.component';
import { AdminDetailsService } from '../../services/admin-details.service';
import { AdminDocumentsDetailsComponent } from '../admin-documents-details/admin-documents-details.component';
import { SnackBarService } from 'libs/shared/material/src';
import { Clipboard } from '@angular/cdk/clipboard';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { JourneyDialogComponent } from '../journey-dialog/journey-dialog.component';
import { Subject, Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ManualCheckinComponent } from '../manual-checkin/manual-checkin.component';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @ViewChild('adminDocumentsDetailsComponent')
  documentDetailComponent: AdminDocumentsDetailsComponent;
  self;
  detailsForm: FormGroup;
  details;
  isGuestInfoPatched: boolean = false;
  primaryGuest;
  isReservationDetailFetched: boolean = false;
  shareIconList;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];
  @Input() bookingId;
  @Output() onDetailsClose = new EventEmitter();
  branchConfig;
  $subscription = new Subscription();
  @Input() tabKey = 'guest_details';

  defaultIconList = [
    { iconUrl: 'assets/svg/messenger.svg', label: 'Request', value: '' },
    { iconUrl: 'assets/svg/email.svg', label: 'Email', value: 'email' },
  ];

  detailsConfig = [
    {
      key: 'guest_details',
      index: 0,
    },
    {
      key: 'document_details',
      index: 1,
    },
    {
      key: 'package_details',
      index: 2,
    },
    {
      key: 'payment_details',
      index: 3,
    },
    {
      key: 'request_details',
      index: 4,
    },
  ];

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminDetailsService: AdminDetailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBarService: SnackBarService,
    private _clipboard: Clipboard,
    public feedbackService: FeedbackService,
    private _modal: ModalService,
    private router: Router,
    private _hotelDetailService: HotelDetailService,
    private _globalFilterService: GlobalFilterService,
    private _userDetailService: UserDetailService
  ) {
    this.self = this;
    this.initDetailsForm();
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        const { hotelName: brandId, branchName: branchId } = data[
          'filter'
        ].value.property;
        const brandConfig = this._hotelDetailService.hotelDetails.brands.find(
          (brand) => brand.id == brandId
        );
        this.branchConfig = brandConfig.branches.find(
          (branch) => branch.id == branchId
        );
        this.getShareIcon();
        this.getReservationDetails();
      })
    );
  }

  getShareIcon() {
    this._userDetailService
      .getUserShareIconByNationality(this.branchConfig.nationality)
      .subscribe(
        (response) => {
          this.shareIconList = new ShareIconConfig().deserialize(response);
          this.shareIconList = this.shareIconList.applications.concat(
            this.defaultIconList
          );
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  getReservationDetails() {
    this._reservationService.getReservationDetails(this.bookingId).subscribe(
      (response) => {
        this.details = new Details().deserialize(response);
        this.mapValuesInForm();
        this.isReservationDetailFetched = true;
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
        this.closeDetails();
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

  mapValuesInForm() {
    this.reservationDetailsFG.patchValue(this.details.reservationDetails);
    this.regCardDetailsFG.patchValue(this.details.regCardDetails);
  }

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
        (res) => {
          if (res && res.file_download_url) {
            FileSaver.saveAs(
              res.file_download_url,
              'invoice_' +
                this.reservationDetailsFG.get('bookingNumber').value +
                new Date().getTime() +
                '.pdf'
            );
          }
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  prepareInvoice() {
    this._reservationService
      .prepareInvoice(this.reservationDetailsFG.get('bookingId').value)
      .subscribe(
        (res) => {
          this._snackBarService.openSnackBarAsText(
            'Ticket raised for invoice',
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

  downloadRegcard(regcardUrl) {
    if (regcardUrl) {
      FileSaver.saveAs(
        regcardUrl,
        'regcard' +
          this.reservationDetailsFG.get('bookingNumber').value +
          new Date().getTime() +
          '.pdf'
      );
    }
  }

  downloadHealthcard(healthCardUrl) {
    if (healthCardUrl) {
      FileSaver.saveAs(
        healthCardUrl,
        'healthCard' +
          this.reservationDetailsFG.get('bookingNumber').value +
          new Date().getTime() +
          '.pdf'
      );
    }
  }

  sendInvoice() {}

  confirmAndNotifyCheckin() {
    this._reservationService
      .checkCurrentWindow(this.reservationDetailsFG.get('bookingId').value)
      .subscribe(
        (res) => {
          const journeyName = res.journey;
          switch (journeyName) {
            case 'EARLYCHECKIN':
              this.openJourneyDialog({
                title: 'Early Check-In Request',
                description:
                  'Guest checkin request is before scheduled arrival time.',
                buttons: {
                  cancel: {
                    label: 'Cancel',
                    context: '',
                  },
                  accept: {
                    label: 'Accept',
                    context: this,
                    handler: {
                      fn_name: 'verifyJourney',
                      args: ['CHECKIN', 'ACCEPT'],
                    },
                  },
                },
              });
              break;
            case 'CHECKIN':
              this.openJourneyDialog({
                title: 'Check-In Request',
                description: 'Guest is about to checkin.',
                buttons: {
                  cancel: {
                    label: 'Cancel',
                    context: '',
                  },
                  accept: {
                    label: 'Accept',
                    context: this,
                    handler: {
                      fn_name: 'verifyJourney',
                      args: ['CHECKIN', 'ACCEPT'],
                    },
                  },
                },
              });
              break;
            case 'LATECHECKIN ':
              this.openJourneyDialog({
                title: 'Early Check-In Request',
                description:
                  'Guest checkin request is after checkin request window.',
                buttons: {
                  cancel: {
                    label: 'Cancel',
                    context: '',
                  },
                  accept: {
                    label: 'Accept',
                    context: this,
                    handler: {
                      fn_name: 'verifyJourney',
                      args: ['CHECKIN', 'ACCEPT'],
                    },
                  },
                },
              });
              break;
            case 'EARLYCHECKOUT':
              break;
            case 'CHECKOUT':
              break;
            case 'LATECHECKOUT':
              break;
          }
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  manualCheckin() {
    const config = {
      title: 'Manual Checkin',
      description: '',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    const manualCheckinCompRef = this._modal.openDialog(
      ManualCheckinComponent,
      dialogConfig
    );

    manualCheckinCompRef.componentInstance.guest = this.primaryGuest;
    manualCheckinCompRef.componentInstance.config = config;

    manualCheckinCompRef.componentInstance.onDetailsClose.subscribe((res) => {
      if (res?.status) {
        this._reservationService
          .manualCheckin(
            this.reservationDetailsFG.get('bookingId').value,
            res.data
          )
          .subscribe(
            (response) => {
              this._snackBarService.openSnackBarAsText(
                'Guest Manually Checked In',
                '',
                { panelClass: 'success' }
              );
              manualCheckinCompRef.close();
              this.closeDetails();
            },
            ({ error }) =>
              this._snackBarService.openSnackBarAsText(error.message)
          );
      } else res && manualCheckinCompRef.close();
    });
  }

  openJourneyDialog(config) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    const journeyDialogCompRef = this._modal.openDialog(
      JourneyDialogComponent,
      dialogConfig
    );

    journeyDialogCompRef.componentInstance.config = config;

    journeyDialogCompRef.componentInstance.onDetailsClose.subscribe((res) => {
      res && journeyDialogCompRef.close();
    });
  }

  verifyJourney(journeyName, status) {
    let data = {
      journey: journeyName,
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
          this._snackBarService.openSnackBarAsText(
            `${journeyName[0]
              .toUpperCase()
              .concat(
                journeyName.slice(1, journeyName.length).toLowerCase()
              )} completed`,
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

  getPrimaryGuestDetails() {
    this.details.guestDetails.forEach((guest) => {
      if (guest.isPrimary === true) {
        this.primaryGuest = guest;
        return;
      }
    });
  }

  openSendNotification(channel) {
    if (channel) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '100%';
      const notificationCompRef = this._modal.openDialog(
        NotificationComponent,
        dialogConfig
      );

      if (channel === 'email') {
        notificationCompRef.componentInstance.isEmail = true;
        notificationCompRef.componentInstance.email = this.primaryGuest.email;
      } else {
        notificationCompRef.componentInstance.isEmail = false;
        notificationCompRef.componentInstance.channel = channel;
      }
      notificationCompRef.componentInstance.roomNumber = this.details.stayDetails.roomNumber;
      notificationCompRef.componentInstance.hotelId = this.details.reservationDetails.hotelId;
      notificationCompRef.componentInstance.isModal = true;
      notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
        // remove loader for detail close
        notificationCompRef.close();
      });
    } else {
      this._modal.close();
      this.router.navigateByUrl('/pages/request');
    }
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

  get tabIndex() {
    let { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key == this.tabKey
    );
    return index ? index : 0;
  }
}
