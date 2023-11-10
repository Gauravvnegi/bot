import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  OfferData,
  OfferList,
  SummaryData,
} from '../../../models/reservations.model';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { manageReservationRoutes } from '../../../constants/routes';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription } from 'rxjs';
import { PaymentMethod, ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';
import {
  EntitySubType,
  EntityType,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { RoomReservationRes } from '../../../types/response.type';
import {
  OccupancyDetails,
  RoomReservationFormData,
} from '../../../types/forms.types';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';

@Component({
  selector: 'hospitality-bot-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: [
    './booking-summary.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class BookingSummaryComponent implements OnInit {
  reservationId: string;
  entityId: string;
  displayBookingOffer = false;
  parentFormGroup: FormGroup;
  isBooking = false;
  detailsView = false;
  dateDifference: number = 1;

  heading = '';
  bookingType: EntitySubType;
  outletId = '';
  occupancyDetails: OccupancyDetails;
  $subscription = new Subscription();

  @Input() summaryData: SummaryData;
  @Input() selectedOffer: OfferData;
  @Input() offersList: OfferList;
  @Input() disabledForm: boolean;
  @Input() set bookingInfo(value: BookingSummaryInfo) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  // @Output() onSubmitBooking: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOfferSelect: EventEmitter<void> = new EventEmitter<void>();
  @Output() onOfferItemSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() handleInitForm: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public controlContainer: ControlContainer,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private manageReservationService: ManageReservationService,
    private routesConfigService: RoutesConfigService,
    protected activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private _clipboard: Clipboard,
    public formService: FormService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const summaryDataChanges = changes?.summaryData?.currentValue;
    if (summaryDataChanges?.bookingItems?.length < 2) this.detailsView = false;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.parentFormGroup = this.controlContainer.control as FormGroup;

    this.formService.dateDifference.subscribe((res) => {
      this.dateDifference = res;
    });
  }

  offerSelect(item?: any): void {
    if (!this.formService.disableBtn) {
      // Disable button when checkin completed
      if (item) {
        this.displayBookingOffer = !this.displayBookingOffer;
        this.onOfferItemSelect.emit(item);
      } else {
        this.onOfferSelect.emit();
      }
    }
  }

  applyOffer() {
    if (!this.formService.disableBtn)
      this.displayBookingOffer = !this.displayBookingOffer;
  }

  handleBooking(): void {
    if (this.controlContainer.control.invalid && !this.reservationId) {
      this.controlContainer.control.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    this.isBooking = true;
    let data: any;

    const id =
      this.bookingType === EntitySubType.ROOM_TYPE
        ? this.entityId
        : this.outletId;
    const type =
      this.bookingType === EntitySubType.ROOM_TYPE
        ? EntitySubType.ROOM_TYPE
        : EntityType.OUTLET;
    if (this.bookingType === EntitySubType.ROOM_TYPE)
      data = this.formService.mapRoomReservationData(
        this.parentFormGroup.getRawValue(),
        id
      );
    else
      data = this.formService.mapOutletReservationData(
        this.parentFormGroup.getRawValue(),
        this.bookingType
      );
    if (this.reservationId) {
      this.updateReservation(data, id, type);
    } else this.createReservation(data, id, type);
  }

  createReservation(
    data: RoomReservationFormData,
    entityId: string,
    type: string
  ): void {
    const { id, ...formData } = data;
    this.$subscription.add(
      this.manageReservationService
        .createReservation(entityId, formData, type)
        .subscribe(
          (res: RoomReservationRes) => {
            this.bookingConfirmationPopup(res?.reservationNumber);
          },
          (error) => {
            this.isBooking = false;
          },
          () => {
            this.isBooking = false;
          }
        )
    );
  }

  updateReservation(
    data: RoomReservationFormData,
    entityId: string,
    type: string
  ): void {
    this.$subscription.add(
      this.manageReservationService
        .updateReservation(entityId, this.reservationId, data, type)
        .subscribe(
          (res: RoomReservationRes) => {
            this.bookingConfirmationPopup(res?.reservationNumber);
          },
          (error) => {
            this.isBooking = false;
          },
          () => {
            this.isBooking = false;
          }
        )
    );
  }

  /**
   * @function bookingConfirmationPopup
   */
  bookingConfirmationPopup(number?): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );
    togglePopupCompRef.componentInstance.content = {
      heading: `Reservation ${
        this.reservationId ? 'Updated' : 'Created'
      } Successfully`,

      description: [
        `Congratulations! Your reservation has been ${
          this.reservationId ? 'updated' : 'created'
        } successfully.`,
        ` Your confirmation number is ${number}.`,
        // "Keep this number safe as you'll need it for any future inquiries or changes to your reservation.",
      ],
    };
    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Continue Reservation',
        onClick: () => {
          // Route but don't change location
          this.routesConfigService
            .navigate({
              skipLocationChange: true,
            })
            .then(() => {
              this.routesConfigService.navigate({
                additionalPath: manageReservationRoutes.addReservation.route,
                queryParams: {
                  entityId: this.outletId ? this.outletId : this.entityId,
                },
              });
            });
          // this.router
          //   .navigateByUrl('/pages/efrontdesk/reservation', {
          //     skipLocationChange: true,
          //   })
          //   .then(() => {
          //     // Route again to reload all form and service values.
          //     this.router.navigate(
          //       [
          //         `/pages/efrontdesk/reservation/${manageReservationRoutes.addReservation.route}`,
          //       ],
          //       {
          //         queryParams: {
          //           entityId: this.outletId ? this.outletId : this.entityId,
          //         },
          //       }
          //     );
          //   });
          this.modalService.close();
        },
        variant: 'outlined',
      },
      {
        label: 'Copy Confirmation number',
        onClick: () => {
          this.copiedConfirmationNumber(number);
          this.modalService.close();
          this.gobackToReservation();
        },
        variant: 'contained',
      },
    ];
    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
      this.gobackToReservation();
    });
  }

  openDetailsPage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = this.reservationId;
    detailCompRef.componentInstance.tabKey = 'payment_details';
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        detailCompRef.close();
      })
    );
  }

  gobackToReservation() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
    });
  }

  calculateAmountToBePaid(summaryData) {
    const totalAmount = summaryData.totalDueAmount
      ? summaryData.totalDueAmount
      : summaryData.totalAmount;

    // When total due amount is 0.
    const totalPaidAmount =
      summaryData.totalPaidAmount && !summaryData.totalDueAmount
        ? summaryData.totalPaidAmount
        : this.paymentControls.totalPaidAmount.value;

    return totalAmount - totalPaidAmount;
  }

  copiedConfirmationNumber(number): void {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Confirmation number copied', '', {
      panelClass: 'success',
    });
  }

  get inputControls() {
    return this.parentFormGroup.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get paymentControls() {
    return (this.parentFormGroup.get('paymentMethod') as FormGroup)
      .controls as Record<keyof PaymentMethod, AbstractControl>;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

type BookingSummaryInfo = {
  bookingType: string;
  outletId?: string;
  heading: string;
  occupancyDetails?: OccupancyDetails;
};
