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
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { manageReservationRoutes } from '../../../constants/routes';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { PaymentMethod, ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';
import { EntitySubType, EntityType } from '@hospitality-bot/admin/shared';
import { RoomReservationRes } from '../../../types/response.type';
import {
  OccupancyDetails,
  RoomReservationFormData,
} from '../../../types/forms.types';

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
    private location: Location,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private _clipboard: Clipboard,
    private formService: FormService
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
    if (item) {
      this.displayBookingOffer = !this.displayBookingOffer;
      this.onOfferItemSelect.emit(item);
    } else {
      this.onOfferSelect.emit();
    }
  }

  handleBooking(): void {
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
          this.router.navigate(
            [
              `/pages/efrontdesk/reservation/${manageReservationRoutes.addReservation.route}`,
            ],
            { replaceUrl: true }
          );
          // this.handleInitForm.emit();
          this.parentFormGroup.reset();
          this.handleInitForm.emit();
          this.initDefaultData();
          this.modalService.close();
        },
        variant: 'outlined',
      },
      {
        label: 'Copy Confirmation number',
        onClick: () => {
          this.copiedConfirmationNumber(number);
          this.modalService.close();
          this.location.back();
        },
        variant: 'contained',
      },
    ];
    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
      this.location.back();
    });
  }

  copiedConfirmationNumber(number): void {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Confirmation number copied', '', {
      panelClass: 'success',
    });
  }

  initDefaultData() {
    this.formService.initialData.subscribe((res) => {
      if (res) {
        this.inputControls.paymentMethod.patchValue({
          cashierFirstName: res.cashierFirstName,
          cashierLastName: res.cashierLastName,
          currency: res.currency,
          totalPaidAmount: 0,
        });
      }
    });
    this.formService.setInitialDates.next('');
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
}

type BookingSummaryInfo = {
  bookingType: string;
  outletId?: string;
  heading: string;
  occupancyDetails?: OccupancyDetails;
};
