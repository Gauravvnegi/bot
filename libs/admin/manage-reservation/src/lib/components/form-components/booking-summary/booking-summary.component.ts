import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { manageBookingRoutes } from '../../../constants/routes';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { ReservationResponse } from '../../../types/response.type';
import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReservationForm } from '../../../constants/form';
import { FormService } from '../../../services/form.service';

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

  header = '';
  subHeader = '';
  stayInfo = '';
  price = 0;
  guestInfo = '';
  discountedPrice = 0;
  bookingType = '';
  outletId = '';

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

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.listenForPriceChanges();
  }

  listenForPriceChanges() {
    this.formService.price.subscribe((res) => {
      this.price = res;
    });
    this.formService.discountedPrice.subscribe((res) => {
      this.discountedPrice = res;
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
    if (this.bookingType === 'HOTEL')
      data = this.manageReservationService.mapReservationData(
        this.parentFormGroup.getRawValue()
      );
    else
      data = this.formService.mapOutletReservationData(
        this.parentFormGroup.getRawValue(),
        this.bookingType
      );
    if (this.reservationId) this.updateReservation(data);
    else this.createReservation(data);
  }

  createReservation(data): void {
    this.$subscription.add(
      this.manageReservationService
        .createReservation(this.outletId, data, this.bookingType)
        .subscribe(
          (res: ReservationResponse) => {
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

  updateReservation(data): void {
    this.$subscription.add(
      this.manageReservationService
        .updateReservation(this.outletId, this.reservationId, data)
        .subscribe(
          (res: ReservationResponse) => {
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
              `/pages/efrontdesk/manage-reservation/${manageBookingRoutes.addBooking.route}`,
            ],
            { replaceUrl: true }
          );
          // this.userForm.reset();
          this.handleInitForm.emit();
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

  get inputControl() {
    return this.parentFormGroup.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }
}

type BookingSummaryInfo = {
  header: string;
  subHeader: string;
  itemInfo: string;
  price: string;
  guestInfo: string;
  discountedPrice: string;
  bookingType: string;
  outletId?: string;
};
