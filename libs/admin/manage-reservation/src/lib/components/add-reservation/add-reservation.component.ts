import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  AdminUtilityService,
  ConfigService,
  CountryCodeList,
  NavRouteOptions,
  Option,
  Regex,
} from 'libs/admin/shared/src';
import { Subscription, forkJoin } from 'rxjs';
import {
  Reservation,
  roomFields,
  RoomFieldTypeOption,
} from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  BookingConfig,
  OfferData,
  OfferList,
  PaymentMethodList,
  RoomTypeOptionList,
  SummaryData,
} from '../../models/reservations.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservationFormData } from '../../models/reservations.model';
import * as moment from 'moment';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss'],
})
export class AddReservationComponent implements OnInit {
  userForm: FormGroup;
  hotelId: string;
  reservationId: string;
  roomTypes: RoomFieldTypeOption[] = [];
  paymentOptions: Option[] = [];
  currencies: Option[] = [];
  reservationTypes: Option[] = [];
  offersList: OfferList;
  selectedOffer: OfferData;
  globalQueries = [];
  roomTypeOffSet = 0;
  roomTypeLimit = 50;
  countries;
  summaryData: SummaryData;
  configData: BookingConfig;
  roomFields = roomFields;

  displayBookingOffer: boolean = false;
  formValueChanges = false;
  startMinDate = new Date();
  endMinDate = new Date();

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
    protected activatedRoute: ActivatedRoute,
    private configService: ConfigService
  ) {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
    this.initForm();
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getCountryCode();
    this.listenForGlobalFilters();
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
          [Validators.required, Validators.pattern(Regex.NUMBER_REGEX)],
        ],
        currency: ['INR'],
        paymentMethod: ['', Validators.required],
        paymentRemark: ['', [Validators.maxLength(60)]],
      }),
      offerId: [''],
    });
  }

  getCountryCode() {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
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
      }
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getInitialData(this.globalQueries);
      this.getReservationId();
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
      .get('roomInformation.adultCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          this.getSummaryData();
        }
      });
    this.userForm
      .get('roomInformation.childCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
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
          this.getSummaryData();
        }
      });
  }

  getInitialData(queries): void {
    const defaultProps = {
      type: 'ROOM_TYPE',
      offset: this.roomTypeOffSet,
      limit: this.roomTypeLimit,
    };
    queries.push(defaultProps);
    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };
    this.$subscription.add(
      forkJoin({
        paymentMethods: this.manageReservationService.getPaymentMethod(
          this.hotelId
        ),
        roomData: this.manageReservationService.getRoomTypeList<
          RoomTypeListResponse
        >(this.hotelId, config),
      }).subscribe((response) => {
        this.paymentOptions = new PaymentMethodList()
          .deserialize(response.paymentMethods)
          .records.map((item) => ({ label: item.label, value: item.label }));
        const data = new RoomTypeOptionList()
          .deserialize(response.roomData)
          .records.map((item) => ({
            label: item.name,
            value: item.id,
            roomCount: item.roomCount,
            maxChildren: item.maxChildren,
            maxAdult: item.maxAdult,
          }));
        this.roomTypes = [...this.roomTypes, ...data];
        roomFields[0].options = this.roomTypes;
      }, this.handleError)
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
          this.userForm.valueChanges.subscribe((_) => {
            if (!this.formValueChanges) {
              this.formValueChanges = true;
              this.listenForFormChanges();
            }
          });
        } else
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
      })
    );
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.hotelId)
        .subscribe((response) => {
          const data = new ReservationFormData().deserialize(response);
          this.userForm.patchValue(data);
          this.userForm.get('bookingInformation.source').disable();
        }, this.handleError)
    );
  }

  getOfferByRoomType(id: string): void {
    if (id)
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.hotelId, id)
          .subscribe((response) => {
            this.offersList = new OfferList().deserialize(response);
            if (this.userForm.get('offerId').value) {
              this.selectedOffer = this.offersList.records.filter(
                (item) => item.id === this.userForm.get('offerId').value
              )[0];
            }
          }, this.handleError)
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
        this.manageReservationService
          .getSummaryData(config)
          .subscribe((res) => {
            this.summaryData = new SummaryData().deserialize(res);
            this.userForm
              .get('roomInformation')
              .patchValue(this.summaryData, { emitEvent: false });
          }, this.handleError)
      );
  }

  HandleBooking(): void {
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
        .subscribe((_) => {
          this.snackbarService.openSnackBarAsText(
            'Reservation created Successfully.',
            '',
            { panelClass: 'success' }
          );
          this.location.back();
        }, this.handleError)
    );
  }

  updateReservation(data): void {
    this.$subscription.add(
      this.manageReservationService
        .updateReservation(this.hotelId, this.reservationId, data)
        .subscribe((_) => {
          this.snackbarService.openSnackBarAsText(
            'Reservation updated Successfully.',
            '',
            { panelClass: 'success' }
          );
          this.location.back();
        }, this.handleError)
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  };

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
