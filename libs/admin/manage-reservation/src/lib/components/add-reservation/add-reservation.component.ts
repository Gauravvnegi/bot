import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import {
  AdminUtilityService,
  ConfigService,
  CountryCodeList,
  NavRouteOptions,
  Option,
  Regex,
} from 'libs/admin/shared/src';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { manageReservationRoutes } from '../../constants/routes';
import {
  BookingConfig,
  BookingInfo,
  OfferData,
  OfferList,
  PaymentMethodList,
  ReservationFormData,
  SummaryData,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationResponse } from '../../types/response.type';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss'],
})
export class AddReservationComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  hotelId: string;
  reservationId: string;
  paymentOptions: Option[] = [];
  currencies: Option[] = [];
  reservationTypes: Option[] = [];
  offersList: OfferList;
  selectedOffer: OfferData;
  countries: Option[] = [];
  summaryData: SummaryData;
  configData: BookingConfig;
  loading = false;
  displayBookingOffer: boolean = false;
  formValueChanges = false;
  disabledForm = false;
  startMinDate = new Date();
  endMinDate = new Date();
  isBooking = false;

  pageTitle = 'Add Booking';
  routes: NavRouteOptions = [
    { label: 'eFrontdesk', link: './' },
    { label: 'Booking', link: '/pages/efrontdesk/manage-reservation' },
    { label: 'Add Booking', link: './' },
  ];

  $subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private manageReservationService: ManageReservationService,
    private location: Location,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private modalService: ModalService,
    private _clipboard: Clipboard
  ) {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
    this.initForm();
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getCountryCode();
    this.getInitialData();
    this.getReservationId();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;

    this.userForm = this.fb.group({
      bookingInformation: this.fb.group({
        from: [startTime, Validators.required],
        to: [endTime, Validators.required],
        reservationType: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      guestInformation: this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(60)]],
        lastName: ['', [Validators.required, Validators.maxLength(60)]],
        email: [
          '',
          [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)],
        ],
        countryCode: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(Regex.NUMBER_REGEX)],
        ],
      }),
      address: this.fb.group({
        addressLine1: ['', [Validators.required]],
        city: ['', [Validators.required]],
        countryCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
      }),
      paymentMethod: this.fb.group({
        totalPaidAmount: [
          '',
          [Validators.pattern(Regex.DECIMAL_REGEX), Validators.min(1)],
        ],
        currency: [''],
        paymentMethod: [''],
        paymentRemark: ['', [Validators.maxLength(60)]],
      }),
      offerId: [''],
    });
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.configData.source = this.configData.source.filter(
          (item) => item.value !== 'CREATE_WITH' && item.value !== 'OTHERS'
        );
      });
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
    });
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { currencyConfiguration } = value;
        this.currencies = currencyConfiguration.map(({ key, value }) => ({
          label: key,
          value,
        }));
        this.userForm.get('paymentMethod').patchValue({
          currency: this.currencies[0].value,
        });
      }
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.userForm
      .get('roomInformation.roomTypeId')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          this.userForm.get('offerId').reset();
          this.getOfferByRoomType(res);
          this.getSummaryData();
        }
      });
    this.userForm
      .get('roomInformation.roomCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          if (
            this.userForm.get('roomInformation.roomCount').value >
            this.userForm.get('roomInformation.adultCount').value
          )
            this.userForm
              .get('roomInformation.adultCount')
              .patchValue(this.userForm.get('roomInformation.roomCount').value);
        }
      });
  }

  getInitialData(): void {
    this.$subscription.add(
      this.manageReservationService.getPaymentMethod(this.hotelId).subscribe(
        (response) => {
          const types = new PaymentMethodList()
            .deserialize(response)
            .records.map((item) => item.type);
          const labels = [].concat(
            ...types.map((array) => array.map((item) => item.label))
          );
          this.paymentOptions = labels.map((label) => ({
            label: label,
            value: label,
          }));
        },
        (error) => {}
      )
    );
  }

  getReservationId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.reservationId = params['id'];
          this.pageTitle = 'Edit Booking';
          this.routes[2].label = 'Edit Booking';
          this.reservationTypes = [
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Confirmed', value: 'CONFIRMED' },
            { label: 'Cancelled', value: 'CANCELED' },
          ];
          this.getReservationDetails();
        } else {
          this.reservationTypes = [
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Confirmed', value: 'CONFIRMED' },
          ];
          this.userForm.valueChanges.subscribe((_) => {
            if (!this.formValueChanges) {
              this.formValueChanges = true;
              this.listenForFormChanges();
            }
          });
        }
      })
    );
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.hotelId)
        .subscribe(
          (response) => {
            const data = new ReservationFormData().deserialize(response);
            this.userForm.patchValue(data);
            this.summaryData = new SummaryData().deserialize(response);
            this.setFormDisability(data.bookingInformation);
            if (data.offerId)
              this.getOfferByRoomType(
                this.userForm.get('roomInformation.roomTypeId').value
              );
            this.userForm.valueChanges.subscribe((_) => {
              if (!this.formValueChanges) {
                this.formValueChanges = true;
                this.listenForFormChanges();
              }
            });
          },
          (error) => {}
        )
    );
  }

  setFormDisability(data: BookingInfo): void {
    this.userForm.get('bookingInformation.source').disable();
    switch (true) {
      case data.reservationType === 'CONFIRMED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.reservationType === 'CANCELED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.source === 'CREATE_WITH':
        this.disabledForm = true;
        break;
      case data.source === 'OTHERS':
        this.disabledForm = true;
        break;
    }
  }

  getOfferByRoomType(id: string): void {
    if (id)
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.hotelId, id)
          .subscribe(
            (response) => {
              this.offersList = new OfferList().deserialize(response);
              if (this.userForm.get('offerId').value) {
                this.selectedOffer = this.offersList.records.filter(
                  (item) => item.id === this.userForm.get('offerId').value
                )[0];
              }
            },
            (error) => {}
          )
      );
  }

  offerSelect(offerData?: OfferData): void {
    if (offerData) {
      this.displayBookingOffer = !this.displayBookingOffer;
      this.userForm.patchValue({ offerId: offerData.id });
      this.getSummaryData();
    } else {
      this.userForm.get('offerId').reset();
      this.getSummaryData();
    }
    this.selectedOffer = offerData;
  }

  getSummaryData(): void {
    const defaultProps = [
      {
        type: 'ROOM_TYPE',
        fromDate: this.userForm.get('bookingInformation.from')?.value,
        toDate: this.userForm.get('bookingInformation.to')?.value,
        adultCount: this.userForm.get('roomInformation.adultCount')?.value || 1,
        roomCount: this.userForm.get('roomInformation.roomCount')?.value || 1,
        childCount: this.userForm.get('roomInformation.childCount')?.value || 0,
        roomType: this.userForm.get('roomInformation.roomTypeId')?.value,
        offerId: this.userForm.get('offerId')?.value,
        entityId: this.hotelId,
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };
    if (this.userForm.get('roomInformation.roomTypeId')?.value)
      this.$subscription.add(
        this.manageReservationService.getSummaryData(config).subscribe(
          (res) => {
            this.summaryData = new SummaryData().deserialize(res);
            this.userForm
              .get('roomInformation')
              .patchValue(this.summaryData, { emitEvent: false });
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .setValidators([Validators.max(this.summaryData.totalAmount)]);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .updateValueAndValidity();
          },
          (error) => {}
        )
      );
  }

  handleBooking(): void {
    this.isBooking = true;
    const data = this.manageReservationService.mapReservationData(
      this.userForm.getRawValue()
    );
    if (this.reservationId) this.updateReservation(data);
    else this.createReservation(data);
  }

  createReservation(data): void {
    this.$subscription.add(
      this.manageReservationService
        .createReservation(this.hotelId, data)
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
        .updateReservation(this.hotelId, this.reservationId, data)
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
      heading: `Booking ${
        this.reservationId ? 'Updated' : 'Created'
      } Successfully`,

      description: [
        `Congratulations! Your booking has been ${
          this.reservationId ? 'updated' : 'created'
        } successfully.`,
        ` Your confirmation number is ${number}.`,
        // "Keep this number safe as you'll need it for any future inquiries or changes to your reservation.",
      ],
    };
    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Continue Booking',
        onClick: () => {
          this.router.navigate(
            [
              `/pages/efrontdesk/manage-reservation/${manageReservationRoutes.addReservation.route}`,
            ],
            { replaceUrl: true }
          );
          // this.userForm.reset();
          this.initForm();
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

  /**
   * @function handleOfferView handle offer view.
   */
  handleOfferView(): void {
    this.displayBookingOffer = !this.displayBookingOffer;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
