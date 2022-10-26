import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ConfigService, UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import {
  Details,
  ShareIconConfig,
} from '../../../../../shared/src/lib/models/detailsConfig.model';
import { ReservationService } from '../../services/reservation.service';
import { AdminDocumentsDetailsComponent } from '../admin-documents-details/admin-documents-details.component';
import { JourneyDialogComponent } from '../journey-dialog/journey-dialog.component';
import { ManualCheckinComponent } from '../manual-checkin/manual-checkin.component';
import { Guest } from '../../models/guest-table.model';
import { get } from 'lodash';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { GuestDetail, GuestDetails } from '../../models/guest-feedback.model';
import {
  NotificationComponent,
  MarketingNotificationComponent,
} from '@hospitality-bot/admin/notification';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Input() tabKey = 'guest_details';
  @Output() onDetailsClose = new EventEmitter();
  @ViewChild('adminDocumentsDetailsComponent')
  documentDetailComponent: AdminDocumentsDetailsComponent;
  self;
  hotelId: string;
  detailsForm: FormGroup;
  details;
  isGuestInfoPatched = false;
  primaryGuest;
  isReservationDetailFetched = false;
  isGuestReservationFetched = false;
  shareIconList;
  colorMap;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];
  bookingId;
  branchConfig;
  $subscription = new Subscription();

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
      key: 'stay_details',
      index: 2,
    },
    {
      key: 'package_details',
      index: 3,
    },
    {
      key: 'payment_details',
      index: 4,
    },
    {
      key: 'request_details',
      index: 5,
    },
  ];
  guestData;
  guestReservations: GuestDetails;
  guestReservationDropdownList = [];
  @Input() guestId: string;
  @Input() bookingNumber: string;
  bookingFG: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBarService: SnackBarService,
    private _clipboard: Clipboard,
    public feedbackService: FeedbackService,
    private _modal: ModalService,
    private router: Router,
    private _hotelDetailService: HotelDetailService,
    private _globalFilterService: GlobalFilterService,
    private _userService: UserService,
    private subscriptionService: SubscriptionPlanService,
    private configService: ConfigService
  ) {
    this.self = this;
    this.initDetailsForm();
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getConfig();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        const { hotelName: brandId, branchName: branchId } = data[
          'filter'
        ].value.property;
        const brandConfig = this._hotelDetailService.hotelDetails.brands.find(
          (brand) => brand.id === brandId
        );
        this.branchConfig = brandConfig.branches.find(
          (branch) => branch.id === branchId
        );
        this.getShareIcon();
        this.loadGuestInfo();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getConfig() {
    this.configService.$config.subscribe((response) => {
      if (response) this.colorMap = response?.feedbackColorMap;
    });
  }

  loadGuestInfo(): void {
    this.$subscription.add(
      this._reservationService.getGuestById(this.guestId).subscribe(
        (response) => {
          this.guestData = new Guest().deserialize(response);
          this.loadGuestReservations();
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this.closeDetails();
        }
      )
    );
  }

  loadGuestReservations(): void {
    this.$subscription.add(
      this._reservationService.getGuestReservations(this.guestId).subscribe(
        (response) => {
          this.guestReservations = new GuestDetails().deserialize(
            response,
            this.colorMap
          );
          this.initBookingsFG();
          this.initGuestReservationDropdownList();
          this.isGuestReservationFetched = true;
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this.closeDetails();
        }
      )
    );
  }

  getShareIcon() {
    this.$subscription.add(
      this._userService
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
        )
    );
  }

  getReservationDetails() {
    this.$subscription.add(
      this._reservationService.getReservationDetails(this.bookingId).subscribe(
        (response) => {
          this.details = new Details().deserialize(
            response,
            this._globalFilterService.timezone
          );
          this.mapValuesInForm();
          this.isReservationDetailFetched = true;
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this.closeDetails();
        }
      )
    );
  }

  initBookingsFG() {
    this.bookingFG = this._fb.group({
      booking: [''],
    });
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
      this.detailsForm.get('documentStatus').get('status').value === 'COMPLETED'
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
    const data = {
      stepName: 'PAYMENT',
      state: status,
      remarks: '',
    };

    this.$subscription.add(
      this._reservationService
        .updateStepStatus(
          this.reservationDetailsFG.get('bookingId').value,
          data
        )
        .subscribe(
          (res) => {
            this._snackBarService.openSnackBarAsText('Payment accepted', '', {
              panelClass: 'success',
            });
          },
          ({ error }) => {
            this._snackBarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  downloadInvoice() {
    this.$subscription.add(
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
        )
    );
  }

  prepareInvoice() {
    this.$subscription.add(
      this._reservationService
        .prepareInvoice(this.reservationDetailsFG.get('bookingId').value)
        .subscribe(
          (res) => {
            this.details.invoicePrepareRequest = true;
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
        )
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
    manualCheckinCompRef.componentInstance.loading = false;

    manualCheckinCompRef.componentInstance.onDetailsClose.subscribe((res) => {
      if (res?.status) {
        if (res.data.phoneNumber.length === 0) res.data.cc = '';
        manualCheckinCompRef.componentInstance.loading = true;
        this.$subscription.add(
          this._reservationService
            .manualCheckin(
              this.reservationDetailsFG.get('bookingId').value,
              res.data
            )
            .subscribe(
              (response) => {
                manualCheckinCompRef.componentInstance.loading = false;
                this._snackBarService.openSnackBarAsText(
                  'Guest Manually Checked In',
                  '',
                  { panelClass: 'success' }
                );
                manualCheckinCompRef.close();
                this.closeDetails();
              },
              ({ error }) => {
                manualCheckinCompRef.componentInstance.loading = false;
                this._snackBarService.openSnackBarAsText(error.message);
              }
            )
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
    const data = {
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
    if (this.guestReservationDropdownList.length)
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
      dialogConfig.disableClose = false;
      dialogConfig.width = '100%';
      const notificationCompRef = this._modal.openDialog(
        channel === 'email'
          ? MarketingNotificationComponent
          : NotificationComponent,
        dialogConfig
      );

      if (channel === 'email') {
        notificationCompRef.componentInstance.isEmail = true;
        notificationCompRef.componentInstance.email = this.primaryGuest.email;
      } else {
        notificationCompRef.componentInstance.isEmail = false;
        notificationCompRef.componentInstance.channel = channel;
      }
      notificationCompRef.componentInstance.hotelId = this.hotelId;
      notificationCompRef.componentInstance.roomNumber = this.details.stayDetails.roomNumber;
      notificationCompRef.componentInstance.isModal = true;
      notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
        notificationCompRef.close();
      });
    } else {
      this._modal.close();
      this.router.navigateByUrl('/pages/conversation/request');
    }
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  initGuestReservationDropdownList() {
    this.guestReservationDropdownList = new Array<any>();
    this.guestReservations.records.forEach((item: GuestDetail) => {
      if (item.type === 'RESERVATION') {
        this.guestReservationDropdownList.push({
          bookingId: item.reservation.booking.bookingId,
          bookingNumber: item.reservation.booking.bookingNumber,
          label: `${item.subType} Booking`,
        });
      }
    });
    if (this.guestReservationDropdownList.length) {
      if (this.bookingNumber)
        this.bookingId = this.guestReservationDropdownList.filter(
          (booking) => booking.bookingNumber === this.bookingNumber
        )[0].bookingId;
      else {
        this.bookingNumber = this.guestReservationDropdownList[0]?.bookingNumber;
        this.bookingId = this.guestReservationDropdownList[0]?.bookingId;
      }
      this.bookingFG.get('booking').setValue(this.bookingId);
      this.getReservationDetails();
    } else {
      this.isReservationDetailFetched = true;
      this.isGuestInfoPatched = true;
    }
  }

  handleBookingChange(event) {
    this.bookingId = event.value;
    this.isReservationDetailFetched = false;
    this.getReservationDetails();
  }

  getVisitDetaillabel() {
    let label = 'Visit Details';
    if (
      this.checkForStayFeedbackSubscribed() ||
      this.checkForTransactionFeedbackSubscribed()
    )
      label += ' & Feedback';

    return label;
  }

  checkForTransactionFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'FEEDBACK_TRANSACTIONAL', 'active']);
  }

  checkForStayFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'feedback', 'active']);
  }

  get bookingCount() {
    let count = 0;
    count += this.guestReservations.records.length;
    return count;
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
    const { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key === this.tabKey
    );
    return index ? index : 0;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
