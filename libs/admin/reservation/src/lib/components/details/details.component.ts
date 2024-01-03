import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { MarketingNotificationComponent } from '@hospitality-bot/admin/notification';
import {
  BookingDetailService,
  ConfigService,
  ModuleNames,
  Option,
  openModal,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { GuestDetail, GuestDetails } from '../../models/guest-feedback.model';
import { Guest } from '../../models/guest-table.model';
import { ReservationService } from '../../services/reservation.service';
import { AdminDocumentsDetailsComponent } from '../admin-documents-details/admin-documents-details.component';
import { JourneyDialogComponent } from '../journey-dialog/journey-dialog.component';
import { SendMessageComponent } from 'libs/admin/notification/src/lib/components/send-message/send-message.component';
import { MenuItem } from 'primeng/api';
import { FileData } from '../../models/reservation-table.model';
import { SnackbarHandlerService } from 'libs/admin/global-shared/src/lib/services/snackbar-handler.service';
import { SideBarService } from 'libs/admin/shared/src/lib/services/sidebar.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Input() tabKey: DetailsTabOptions = 'guest_details';
  @Output() onDetailsClose = new EventEmitter();
  @ViewChild('adminDocumentsDetailsComponent')
  documentDetailComponent: AdminDocumentsDetailsComponent;
  self;
  entityId: string;
  detailsForm: FormGroup;
  details;
  isGuestInfoPatched = false;
  primaryGuest;
  isReservationDetailFetched = false;
  isFirstTimeFetch = true;
  isGuestReservationFetched = false;
  regCardLoading = false;
  isPrintRate = true;

  shareIconList;
  channels;
  colorMap;
  bookingList = [
    { label: 'Advance Booking', icon: '' },
    { label: 'Current Booking', icon: '' },
  ];
  guestDropDownList: Option[];
  @Input('bookingId') bookingId: string; //reservationId
  @Input() isDecreaseSnackbarZIndex = false;
  @Output() onRoute = new EventEmitter();

  branchConfig;
  $subscription = new Subscription();

  defaultIconList = [
    { iconUrl: 'assets/svg/messenger.svg', label: 'Request', value: '' },
    { iconUrl: 'assets/svg/email.svg', label: 'Email', value: 'email' },
  ];

  detailsConfig: { key: DetailsTabOptions; index: number }[] = [
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
  checkInOptions: MenuItem[] = [
    {
      label: 'Generate Link',
      command: () => {
        this.activateAndgenerateJourney('CHECKIN');
      },
    },
  ];

  checkOutOptions: MenuItem[] = [
    {
      label: 'Generate Link',
      command: () => this.activateAndgenerateJourney('CHECKOUT'),
      disabled: !this.isPrintRate,
    },
  ];

  //sidebar configuration
  @ViewChild('sideBar', { read: ViewContainerRef })
  sideBar: ViewContainerRef;
  sidebarVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _reservationService: ReservationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private snackbarService: SnackBarService,
    private _clipboard: Clipboard,
    public feedbackService: FeedbackService,
    private _hotelDetailService: HotelDetailService,
    private globalFilterService: GlobalFilterService,
    private subscriptionService: SubscriptionPlanService,
    private configService: ConfigService,
    private resolver: ComponentFactoryResolver,
    private routesConfigService: RoutesConfigService,
    public snackbarHandler: SnackbarHandlerService,
    protected sidebarService: SideBarService,
    private dialogService: DialogService,
    private bookingDetailService: BookingDetailService
  ) {
    this.self = this;
    this.snackbarHandler.isDecreaseSnackbarZIndex = false; // Protect MUI Element hiding on snackbar open
    this.increaseZIndex(true);
    this.initDetailsForm();
  }

  ngOnInit(): void {
    this.registerListeners();
    this.getConfig();
    this.subscribeToConfirmDoc();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.$subscription.add(
      this._reservationService.$reinitializeGuestDetails.subscribe((res) => {
        if (res) {
          this.isReservationDetailFetched = false;
          this.getReservationDetails();
        }
      })
    );
    this.channels = this.subscriptionService.getChannelSubscription();
  }

  subscribeToConfirmDoc() {
    this._reservationService.$allDocsAreConfirmed.subscribe((res) => {
      if (res) {
        this.details.stepStatusDetails.documents = 'COMPLETED';
      }
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        const { brandName: brandId, entityName: branchId } = data[
          'filter'
        ].value.property;
        const brandConfig = this._hotelDetailService.brands.find(
          (brand) => brand.id === brandId
        );
        this.branchConfig = brandConfig.entities.find(
          (branch) => branch.id === branchId
        );
        if (this.bookingId) {
          this.getReservationDetails(true);
        } else {
          this.loadGuestInfo();
        }
      })
    );
  }

  getConfig() {
    this.configService.$config.subscribe((response) => {
      if (response) {
        this.colorMap = response?.feedbackColorMap;
        this.shareIconList = response?.communicationChannels;
      }
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
          this.closeDetails();
        }
      )
    );
  }

  currentFeedbackId: string;

  getCurrentBookingGuestDetails() {
    if (this.guestReservations?.records?.length && this.bookingId) {
      const guestDetail = this.guestReservations.records.find(
        (item) => item.reservation.booking.bookingId === this.bookingId
      );

      this.currentFeedbackId =
        guestDetail?.reservation?.visitDetail?.feedbackId;
    }
  }

  downloadFeedback() {
    this.$subscription.add(
      this._reservationService
        .getFeedbackPdf(this.currentFeedbackId)
        .subscribe((response) => {
          const link = document.createElement('a');
          link.href = response.fileDownloadUri;
          link.target = '_blank';
          link.download = response.fileName;
          link.click();
          link.remove();
        })
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
          this.getCurrentBookingGuestDetails();
          this.initBookingsFG();
          this.initGuestReservationDropdownList();
          this.isGuestReservationFetched = true;
        },
        ({ error }) => {
          this.closeDetails();
        }
      )
    );
  }

  /**
   * Handle getting th reservation data based on reservation ID (bookingId)
   * @param initGuestDetails Init guest details is use to fetch guest data after reservation data
   */
  getReservationDetails(initGuestDetails = false) {
    this.$subscription.add(
      this._reservationService.getReservationDetails(this.bookingId).subscribe(
        (response) => {
          if (response) {
            this.details = new Details().deserialize(
              response,
              this.globalFilterService.timezone
            );
            this.isPrintRate =
              response?.paymentSummary?.printRate !== undefined
                ? response?.paymentSummary?.printRate
                : true;
            if (initGuestDetails) {
              this.bookingNumber = response.number;
              this.guestId = response.guestDetails.primaryGuest.id;
              this.loadGuestInfo();
            } else {
              this.mapValuesInForm();
              this.isReservationDetailFetched = true;
            }
          } else {
            this.closeDetails();
          }
        },
        ({ error }) => {
          this.closeDetails();
        },
        () => {
          this.isFirstTimeFetch = false;
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
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.validation.DOCUMENT_ALREADY_VERIFIED',
          priorityMessage: 'Documents are already verified.',
        })
        .subscribe();
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
      .subscribe((res) => {
        this._clipboard.copy(`${res.domain}?token=${res.journey.token}`);
        this.snackbarService.openSnackBarAsText(
          'Link copied successfully',
          '',
          {
            panelClass: 'success',
          }
        );
      });
  }

  checkForDocumentsStatus() {
    return (
      this.detailsForm.get('documentStatus').get('status').value === 'INITIATED'
    );
  }

  get checkForExpiredBooking() {
    //expired booking are those which are not checked in and departure date is passed
    //in-house , due out , checked out

    const departureDateStr = this.details?.stayDetails?.departureDate;

    if (departureDateStr) {
      // Parse the date string to get day, month, and year
      const [day, month, year] = departureDateStr.split('/').map(Number);

      // Note: months are 0-indexed in JavaScript Date, so subtract 1 from the month
      const departureDate = new Date(year, month - 1, day);

      // Set time components of both dates to midnight (00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      departureDate.setHours(0, 0, 0, 0);
      // Compare the day, month, and year components
      return departureDate < today;
    }

    return false;
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
        .subscribe((res) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.PAYMENT_ACCEPTED',
                priorityMessage: 'Payment accepted.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe()
        )
    );
  }

  /**
   * to open reg-card sidebar
   * @param url
   */
  openRegCardSideBar(url: string) {
    if (url) {
      this.sidebarService.openSideBar({
        type: 'URL',
        open: true,
        url: url,
      });
    } else {
      this.regCardLoading = true;
      this.$subscription.add(
        this._reservationService
          .getRegCard(this.reservationDetailsFG.get('bookingId').value)
          .subscribe(
            (res: FileData) => {
              this.sidebarService.openSideBar({
                type: 'URL',
                open: true,
                url: res?.file_download_url,
              });
            },
            ({ error }) => {
              this.regCardLoading = false;
            }
          )
      );
    }
  }

  /**
   * open confirmation voucher sidebar
   */
  openConfirmationVoucher() {
    this.$subscription.add(
      this._reservationService
        .getConfirmationVoucher(this.bookingId)
        .subscribe((res: FileData) => {
          this.sidebarService.openSideBar({
            type: 'URL',
            open: true,
            url: res?.file_download_url,
          });
        })
    );
  }

  downloadInvoice() {
    this.$subscription.add(
      this._reservationService
        .downloadInvoice(this.reservationDetailsFG.get('bookingId').value)
        .subscribe((res) => {
          if (res && res.file_download_url) {
            FileSaver.saveAs(
              res.file_download_url,
              'invoice_' +
                this.reservationDetailsFG.get('bookingNumber').value +
                new Date().getTime() +
                '.pdf'
            );
          }
        })
    );
  }

  get isManageBookingSubscribed() {
    return this.subscriptionService.checkModuleSubscription(
      ModuleNames.ADD_RESERVATION
    );
  }

  manageInvoice() {
    this.onDetailsClose.next(true);
    this.onRoute.next(true);
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.INVOICE,
      additionalPath: `${this.bookingId}`,
    });
  }

  editBooking() {
    this.onDetailsClose.next(true);
    this.onRoute.next(true);
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
      additionalPath: `edit-reservation/${this.bookingId}`,
      queryParams: { entityId: this.entityId },
    });
  }

  prepareInvoice() {
    if (!this.branchConfig.pmsEnable) {
      this.manageInvoice();
    } else
      this.$subscription.add(
        this._reservationService
          .prepareInvoice(this.reservationDetailsFG.get('bookingId').value)
          .subscribe((_) => {
            this.details.invoicePrepareRequest = true;
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.SUCCESS.INVOICE_TICKET_RAISED',
                  priorityMessage: 'Payment accepted.',
                },
                '',
                { panelClass: 'success' }
              )
              .subscribe();
          })
      );
  }

  // downloadRegcard(regcardUrl) {
  //   if (regcardUrl) {
  //     const [name] = regcardUrl.split('/').reverse();
  //     FileSaver.saveAs(regcardUrl, name);
  //   } else {
  //     this.regCardLoading = true;
  //     this.$subscription.add(
  //       this._reservationService
  //         .getRegCard(this.reservationDetailsFG.get('bookingId').value)
  //         .subscribe(
  //           (res: FileData) => {
  //             const [name] = res.file_download_url.split('/').reverse();
  //             this.regCardLoading = false;
  //             FileSaver.saveAs(res.file_download_url, name);
  //           },
  //           ({ error }) => {
  //             this.regCardLoading = false;
  //           }
  //         )
  //     );
  //   }
  // }

  // openRegComp(regUrl: string) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.id = 'modal-component';

  //   dialogConfig.data = {
  //     regcardUrl: regUrl,
  //     signatureImageUrl:
  //       this.summaryDetails.guestDetails.guests[0].signatureUrl || '',
  //   };
  //   this._dialogRef = this._modal.openDialog(
  //     this.regCardComponent,
  //     dialogConfig
  //   );

  //   this._dialogRef.componentInstance.onSave.subscribe((res) => {
  //     this._dialogRef.close();
  //   });
  // }

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

  generateFeedback() {
    this._reservationService
      .generateFeedback(this.reservationDetailsFG.get('bookingId').value)
      .subscribe((res) => {
        this._clipboard.copy(`${res.domain}${res.feedback.token}`);
        this.snackbarService.openSnackBarAsText(
          'Link copied successfully',
          '',
          {
            panelClass: 'success',
          }
        );
      });
  }

  sendInvoice() {}

  confirmAndNotifyCheckin() {
    this._reservationService
      .checkCurrentWindow(this.reservationDetailsFG.get('bookingId').value)
      .subscribe((res) => {
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
              title: 'Late Check-In Request',
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
          case 'EARLYCHECKOUT':
            this.openJourneyDialog({
              title: 'Early Check-Out Request',
              description:
                'Guest checkout request is before scheduled departure time.',

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
                    args: ['CHECKOUT', 'ACCEPT'],
                  },
                },
              },
            });
            break;
          case 'CHECKOUT':
            this.openJourneyDialog({
              title: 'Check-Out Request',
              description: 'Guest is about to checkout.',
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
                    args: ['CHECKOUT', 'ACCEPT'],
                  },
                },
              },
            });
            break;
          case 'LATECHECKOUT':
            this.openJourneyDialog({
              title: 'Late Check-Out Request',
              description:
                'Guest checkout request is after checkout request window.',
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
                    args: ['CHECKOUT', 'ACCEPT'],
                  },
                },
              },
            });
            break;
        }
      });
  }

  manualCheckout() {
    this.openJourneyDialog({
      title: 'Manual Checkout',
      description: 'Guest is about to checkout',
      question: 'Are you sure you want to continue?',
      isSendInvoice: true,
      buttons: {
        cancel: {
          label: 'Cancel',
          context: '',
        },
        accept: {
          label: 'Accept',
          context: this,
          handler: {
            fn_name: 'manualCheckoutfn',
            args: [],
          },
        },
      },
    });
  }

  manualCheckoutfn(invoice?: Record<'isSendInvoice', any>) {
    this._reservationService
      .manualCheckout(
        this.reservationDetailsFG.get('bookingId').value,
        typeof invoice != 'undefined' && {
          params: `?sendInvoice=${invoice?.isSendInvoice}`,
        }
      )
      .subscribe((res) => {
        this.snackbarService.openSnackBarAsText('Checkout completed.', '', {
          panelClass: 'success',
        });
        this.details.currentJourneyDetails.status = 'COMPLETED';
      });
  }

  manualCheckin() {
    this.openJourneyDialog({
      title: 'Check-In',
      description: 'Guest is about to checkin',
      question: 'Are you sure you want to continue?',
      buttons: {
        cancel: {
          label: 'Cancel',
          context: '',
        },
        accept: {
          label: 'Accept',
          context: this,
          handler: {
            fn_name: 'checkInfn',
            args: [],
          },
        },
      },
    });
  }

  checkInfn() {
    this.$subscription.add(
      this._reservationService
        .manualCheckin(this.reservationDetailsFG.get('bookingId').value)
        .subscribe((res) => {
          this.snackbarService.openSnackBarAsText('Checkin completed.', '', {
            panelClass: 'success',
          });
          this.details.currentJourneyDetails.status = 'COMPLETED';
        })
    );
  }

  // manualCheckin() {
  //   const config = {
  //     title: 'Manual Checkin',
  //     description: '',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.width = '450px';
  //   const manualCheckinCompRef = this._modal.openDialog(
  //     ManualCheckinComponent,
  //     dialogConfig
  //   );

  //   manualCheckinCompRef.componentInstance.guest = this.primaryGuest;
  //   manualCheckinCompRef.componentInstance.config = config;
  //   manualCheckinCompRef.componentInstance.loading = false;

  //   manualCheckinCompRef.componentInstance.onDetailsClose.subscribe((res) => {
  //     if (res?.status) {
  //       if (res.data.phoneNumber.length === 0) res.data.cc = '';
  //       manualCheckinCompRef.componentInstance.loading = true;
  //       this.$subscription.add(
  //         this._reservationService
  //           .manualCheckin(
  //             this.reservationDetailsFG.get('bookingId').value,
  //             res.data
  //           )
  //           .subscribe(
  //             (response) => {
  //               manualCheckinCompRef.componentInstance.loading = false;
  //               this.snackbarService
  //                 .openSnackBarWithTranslate(
  //                   {
  //                     translateKey: 'messages.SUCCESS.GUEST_MANUAL_CHECKIN',
  //                     priorityMessage: 'Guest Manually Checked In.',
  //                   },
  //                   '',
  //                   { panelClass: 'success' }
  //                 )
  //                 .subscribe();
  //               manualCheckinCompRef.close();
  //               this.closeDetails();
  //             },
  //             ({ error }) => {
  //               manualCheckinCompRef.componentInstance.loading = false;
  //             }
  //           )
  //       );
  //     } else res && manualCheckinCompRef.close();
  //   });
  // }

  checkForConfirmedBooking() {
    return !['NEW', 'NOSHOW', 'CANCELED'].includes(this.details.pmsStatus);
  }
  openJourneyDialog(config) {
    // TODO: Need to remove
    // this.increaseZIndex(true);
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.width = '450px';
    // const journeyDialogCompRef = this._modal.openDialog(
    //   JourneyDialogComponent,
    //   dialogConfig
    // );

    // journeyDialogCompRef.componentInstance.config = config;

    // journeyDialogCompRef.componentInstance.onDetailsClose.subscribe((res) => {
    //   this.increaseZIndex(false);
    //   res && journeyDialogCompRef.close();
    // });

    openModal({
      config: {
        width: '450px',
        styleClass: 'confirm-dialog',
        data: config,
      },
      component: JourneyDialogComponent,
      dialogService: this.dialogService,
    });
  }

  // TODO: Need to remove
  increaseZIndex(toggleZIndex: boolean) {
    const cdkOverlayContainer = document.querySelector(
      '.cdk-overlay-container'
    ) as HTMLElement;
    if (cdkOverlayContainer)
      cdkOverlayContainer.style.zIndex = toggleZIndex ? '2000' : '1000';
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
      .subscribe((res) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.SUCCESS.JOURNEY_COMPLETED',
              priorityMessage: `${journeyName[0]
                .toUpperCase()
                .concat(
                  journeyName.slice(1, journeyName.length).toLowerCase()
                )} completed`,
            },
            '',
            { panelClass: 'success' }
          )
          .subscribe();
      });
  }

  // getPrimaryGuestDetails() {
  //   if (this.guestReservationDropdownList.length)
  //     this.details.guestDetails.forEach((guest) => {
  //       if (guest.isPrimary === true) {
  //         this.primaryGuest = guest;
  //         return;
  //       }
  //     });
  // }

  openSendNotification(channel) {
    if (channel) {
      // const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = false;
      // dialogConfig.width = '100%';
      // const notificationCompRef = this._modal.openDialog(
      //   channel === 'EMAIL'
      //     ? MarketingNotificationComponent
      //     : SendMessageComponent,
      //   dialogConfig
      // );
      if (channel === 'WHATSAPP_LITE') {
        this.onRoute.emit(true);
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.LIVE_MESSAGING,
        });
        this.closeDetails();
        return;
      }

      this.sidebarVisible = true;
      this.sideBar.clear();
      if (channel === 'EMAIL') {
        const emailFactory = this.resolver.resolveComponentFactory(
          MarketingNotificationComponent
        );
        const emailRef = this.sideBar.createComponent(emailFactory);
        emailRef.instance.isEmail = true;
        emailRef.instance.email = this.primaryGuest.email;
        emailRef.instance.entityId = this.entityId;
        emailRef.instance.details = this.details;
        emailRef.instance.roomNumber = this.details.stayDetails.roomNumber;
        emailRef.instance.isModal = true;
        emailRef.instance.onModalClose.subscribe((res) => {
          this.sidebarVisible = false;
        });
      } else {
        const messageFactory = this.resolver.resolveComponentFactory(
          SendMessageComponent
        );
        const messageRef = this.sideBar.createComponent(messageFactory);
        messageRef.instance.isEmail = false;
        messageRef.instance.channel = channel.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        messageRef.instance.entityId = this.entityId;
        messageRef.instance.roomNumber = this.details.stayDetails.roomNumber;
        messageRef.instance.isModal = true;
        messageRef.instance.onModalClose.subscribe((res) => {
          this.sidebarVisible = false;
        });
      }

      // notificationCompRef.componentInstance.entityId = this.entityId;
      // notificationCompRef.componentInstance.roomNumber = this.details.stayDetails.roomNumber;
      // notificationCompRef.componentInstance.isModal = true;
      // notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
      //   notificationCompRef.close();
      // });
    } else {
      // this._modal.close();
      this.sidebarVisible = false;
      this.closeDetails();
      // this.router.navigateByUrl('/pages/conversation/request');
      // notificationCompRef.componentInstance.entityId = this.entityId;
      // notificationCompRef.componentInstance.roomNumber = this.details.stayDetails.roomNumber;
      // notificationCompRef.componentInstance.isModal = true;
      // notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
      //   notificationCompRef.close();
      // });
    }
  }

  closeDetails() {
    // this.increaseZIndex(false);
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

    if (this.bookingId) {
      this.mapValuesInForm();
      this.isReservationDetailFetched = true;
    } else {
      if (this.guestReservationDropdownList.length) {
        if (this.bookingNumber)
          this.bookingId = this.guestReservationDropdownList.filter(
            (booking) => booking.bookingNumber === this.bookingNumber
          )[0].bookingId;
        else {
          this.bookingNumber = this.guestReservationDropdownList[0]?.bookingNumber;
          this.bookingId = this.guestReservationDropdownList[0]?.bookingId;
        }

        this.getCurrentBookingGuestDetails();
        this.getReservationDetails();
      } else {
        this.isReservationDetailFetched = true;
        this.isGuestInfoPatched = true;
      }
    }
    this.guestDropDownList = this.guestDropDown;
    this.bookingFG.get('booking').setValue(this.bookingId);
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

  getIconUrl(channel) {
    const channelLabel = channel.name.split('_')[0];
    const sharedIcon = this.shareIconList.find(
      (icon) => icon.label === channelLabel
    );
    if (sharedIcon) {
      return channel.isSubscribed ? sharedIcon.iconUrl : sharedIcon.disableIcon;
    }
    return null;
  }

  getSortedChannels() {
    return this.channels
      .filter((channel) => channel.isView && this.getIconUrl(channel))
      .sort((a, b) => {
        const labelA = a.name.split('_')[0].toLowerCase();
        const labelB = b.name.split('_')[0].toLowerCase();
        return labelA.localeCompare(labelB);
      });
  }

  checkForTransactionFeedbackSubscribed() {
    return this.subscriptionService.checkModuleSubscription(
      ModuleNames.FEEDBACK_TRANSACTIONAL
    );
  }

  checkForStayFeedbackSubscribed() {
    return this.subscriptionService.checkModuleSubscription(
      ModuleNames.FEEDBACK
    );
  }

  checkForGenerateFeedbackSubscribed(isSubmitted: boolean) {
    return this.subscriptionService.checkModuleSubscription(ModuleNames.HEDA) &&
      isSubmitted
      ? this.currentFeedbackId
      : !this.currentFeedbackId;
  }

  get isFinanceSubscribed() {
    return (
      this.subscriptionService.checkModuleSubscription(ModuleNames.FINANCE) &&
      this.subscriptionService.checkModuleSubscription(ModuleNames.INVOICE)
    );
  }

  setTab(event) {
    this.tabKey = this.detailsConfig.find(
      (tabConfig) => tabConfig.index === event.index
    )?.key;
  }

  get bookingCount() {
    let count = 0;
    count += this.guestReservations?.records?.length ?? 0;
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

  get checkForCancelBooking() {
    return this.details.pmsStatus && this.details.pmsStatus === 'CHECKEDOUT';
  }

  get checkForCanceledBooking() {
    return this.details.pmsStatus && this.details.pmsStatus === 'CANCELED';
  }

  get checkForValidBooking() {
    return this.details.pmsStatus && this.details.pmsStatus !== 'CHECKEDOUT';
  }

  get tabIndex() {
    const { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key === this.tabKey
    );
    return index ? index : 0;
  }

  get guestDropDown() {
    return this.guestReservationDropdownList.map((item) => ({
      label: toTitleCase(item.label) + ' - ' + item.bookingNumber,
      value: item.bookingId,
    }));
  }

  get isPermissionToCheckInOrOut() {
    return this.subscriptionService.show().isCalenderView;
  }

  ngOnDestroy() {
    this._reservationService.$reinitializeGuestDetails.next(false);
    this.$subscription.unsubscribe();
    this.isFirstTimeFetch = true;
    this.bookingDetailService.resetBookingState();
  }
}

export function toTitleCase(str) {
  return str
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export type DetailsTabOptions =
  | 'guest_details'
  | 'document_details'
  | 'stay_details'
  | 'package_details'
  | 'payment_details'
  | 'request_details';

export interface DetailsDialogData {
  bookingId: string;
  tabKey: DetailsTabOptions;
}
