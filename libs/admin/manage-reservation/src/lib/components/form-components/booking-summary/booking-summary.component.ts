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
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription } from 'rxjs';
import { PaymentMethod, ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';
import {
  BookingDetailService,
  EntitySubType,
  EntityType,
  ModuleNames,
  openModal,
} from '@hospitality-bot/admin/shared';
import { RoomReservationResponse } from '../../../types/response.type';
import {
  OccupancyDetails,
  RoomReservationFormData,
} from '../../../types/forms.types';
import { ReservationType } from '../../../constants/reservation-table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddRefundComponent } from 'libs/admin/invoice/src/lib/components/add-refund/add-refund.component';
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
  outletId = '';
  externalBooking = false;
  offerResponse: ManualOffer;

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

  @Input() loadSummary: boolean = false;

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
    private _clipboard: Clipboard,
    public formService: FormService,
    protected bookingDetailService: BookingDetailService,
    private dialogService: DialogService
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

    const id = this.entityId;
    const type = EntitySubType.ROOM_TYPE;
    const data = this.formService.mapRoomReservationData(
      this.parentFormGroup.getRawValue(),
      id,
      'full',
      this.summaryData.totalAmount,
      this.offerResponse
    );
    if (this.reservationId) {
      if (data.reservationType === ReservationType.CANCELED) {
        this.openCancelPopup(data, id, type);
      } else {
        this.inputControls.rateImprovement.value
          ? this.rateImprovement(data)
          : this.updateReservation(data, type);
      }
    } else this.createReservation(data, id, type);
  }

  rateImprovement(data: RoomReservationFormData) {
    this.manageReservationService
      .rateImprovement(this.entityId, this.reservationId, data)
      .subscribe((res) => {
        if (res?.chargedAmount > 0) {
          let modalRef: DynamicDialogRef;
          const modalData: Partial<AddRefundComponent> = {
            heading: 'Update Reservation',
            isReservationPopup: true,
            chargedAmount: res.chargedAmount,
          };
          modalRef = openModal({
            config: {
              width: '40%',
              styleClass: 'confirm-dialog',
              data: modalData,
            },
            component: AddRefundComponent,
            dialogService: this.dialogService,
          });

          modalRef.onClose.subscribe(
            (res: { chargedAmount: number; remarks: string }) => {
              if (res) {
                this.updateReservation(
                  {
                    chargedAmount: res?.chargedAmount,
                    remarks: res?.remarks,
                    ...data,
                  },
                  'ROOM_TYPE'
                );
              }
            }
          );
        } else {
          this.updateReservation(
            { chargedAmount: res?.chargedAmount, ...data },
            'ROOM_TYPE'
          );
        }
      });
  }

  createReservation(
    data: RoomReservationFormData,
    entityId: string,
    type: string
  ): void {
    this.isBooking = true;
    const { id, ...formData } = data;
    this.$subscription.add(
      this.manageReservationService
        .createReservation(entityId, formData, type)
        .subscribe(
          (res: RoomReservationResponse) => {
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

  updateReservation(data: RoomReservationFormData, type: string): void {
    this.isBooking = true;
    this.$subscription.add(
      this.manageReservationService
        .updateReservation(this.entityId, this.reservationId, data, type)
        .subscribe(
          (res: RoomReservationResponse) => {
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
  bookingConfirmationPopup(number?: string): void {
    let modalRef: DynamicDialogRef;
    const data = {
      content: {
        heading: `Reservation ${
          this.reservationId ? 'Updated' : 'Created'
        } Successfully`,
        descriptions: [
          `Congratulations! Your reservation has been ${
            this.reservationId ? 'updated' : 'created'
          } successfully.`,
          ` Your confirmation number is ${number}.`,
          // "Keep this number safe as you'll need it for any future inquiries or changes to your reservation.",
        ],
      },
      actions: [
        {
          label: 'Continue Reservation',
          onClick: () => {
            modalRef.close();
            this.gobackToReservation();
          },
          variant: 'outlined',
        },
        {
          label: 'Copy Confirmation number',
          onClick: () => {
            this.copiedConfirmationNumber(number);
            modalRef.close();
            this.gobackToReservation();
          },
          variant: 'contained',
        },
      ],
    };

    modalRef = openModal({
      config: {
        width: '35vw',
        styleClass: 'confirm-dialog',
        data: data,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  openCancelPopup(
    data: RoomReservationFormData,
    entityId: string,
    type: string,
    reservationType = ReservationType.CANCELED
  ) {
    let modalRef: DynamicDialogRef;

    this.isBooking = false;
    const modalData = {
      content: {
        heading: `Mark Reservation As ${
          reservationType.charAt(0).toUpperCase() +
          reservationType.slice(1).toLowerCase()
        }`,
        descriptions: [
          `You are about to mark this reservation as ${ReservationType.CANCELED}`,
          `Are you Sure?`,
          this.summaryData?.totalPaidAmount
            ? ` A total of \u20B9 ${this.summaryData?.totalPaidAmount} is received for the reservation`
            : '',
        ],
        isRemarks: true,
      },
      actions: [
        {
          label: 'Cancel & Settlement',
          onClick: () => {
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.INVOICE,
              additionalPath: data.id,
              queryParams: {
                entityId: entityId,
                type: EntitySubType.ROOM_TYPE,
              },
            });

            modalRef.close();
          },
          variant: 'outlined',
        },
        {
          label: 'Yes',
          type: 'SUCCESS',
          onClick: (modelData: { remarks: string }) => {
            let updatedData = { ...data, ...modelData };
            this.updateReservation(updatedData, type);
            modalRef.close();
          },
          variant: 'contained',
        },
      ],
    };

    modalRef = openModal({
      config: {
        width: '35vw',
        styleClass: 'confirm-dialog',
        data: modalData,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  triggerPrintRate(event: HTMLInputElement) {
    this.inputControls.printRate.patchValue(event.checked, {
      emitEvent: false,
    });
  }

  openDetailsPage() {
    this.bookingDetailService.openBookingDetailSidebar({
      bookingId: this.reservationId,
      tabKey: 'guest_details',
    });
  }

  gobackToReservation() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
    });
  }

  calculateAmountToBePaid(summaryData: SummaryData) {
    const totalAmount = summaryData?.totalDueAmount
      ? summaryData.totalDueAmount
      : summaryData.totalAmount;

    // When total due amount is 0.
    const totalPaidAmount =
      summaryData.totalPaidAmount && !summaryData.totalDueAmount
        ? summaryData.totalPaidAmount
        : this.paymentControls.totalPaidAmount.value;
    const refundAmount = summaryData?.refund ? summaryData.refund : 0;
    return totalAmount + refundAmount - totalPaidAmount;
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

  get reservationInfoControls() {
    return (this.controlContainer.control.get(
      'reservationInformation'
    ) as FormGroup).controls as Record<
      keyof ReservationForm['reservationInformation'],
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
  outletId?: string;
  heading: string;
  occupancyDetails?: OccupancyDetails;
  externalBooking: boolean;
  offerResponse?: ManualOffer;
};

export type ManualOffer = {
  offerType?: string;
  discountType?: string;
  discountValue?: number;
  id?: string;
};
