import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  AdminUtilityService,
  ConfigService,
  CountryCode,
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
  OfferData,
  OfferList,
  PaymentMethodList,
  RoomTypeOptionList,
  SummaryData,
} from '../../models/reservations.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservationFormData } from '../../models/reservations.model';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss'],
})
export class AddReservationComponent implements OnInit {
  userForm: FormGroup;
  userFormArray: FormArray;
  hotelId: string;
  reservationId: string;
  roomTypes: RoomFieldTypeOption[] = [];
  paymentOptions: Option[] = [];
  offersList: OfferList;
  selectedOffer: OfferData;
  globalQueries = [];
  roomTypeOffSet = 0;
  roomTypeLimit = 50;
  countries;
  summaryData: SummaryData;
  roomFields = roomFields;
  reservationTypes = Reservation.reservationTypes;
  bookingSources = Reservation.bookingSources;
  marketSegments = Reservation.marketSegments;

  displayBookingOffer: boolean = false;
  formValueChanges = false;
  startMinDate = new Date();
  endMinDate = new Date(Date.now() - 1000 * 60);

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
    this.userFormArray = this.fb.array([]);

    this.userForm = this.fb.group({
      bookingInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        reservationType: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      roomInformation: this.userFormArray,
      guestInformation: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
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
        addressLine1: ['', [Validators.required, Validators.maxLength(60)]],
        city: ['', [Validators.required, Validators.maxLength(60)]],
        countryCode: ['', [Validators.required, Validators.maxLength(60)]],
        state: ['', [Validators.required, Validators.maxLength(60)]],
        postalCode: ['', [Validators.required, Validators.maxLength(60)]],
      }),
      paymentMethod: this.fb.group({
        totalPaidAmount: ['', [Validators.pattern(Regex.NUMBER_REGEX)]],
        paymentMethod: ['', Validators.required],
        paymentRemark: ['', [Validators.maxLength(60)]],
      }),
      offerId: [''],
    });
  }

  getCountryCode() {
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
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
      .get('bookingInformation.from')
      .valueChanges.subscribe((res) => {
        const date = new Date(res);
        this.endMinDate = new Date(res - 1000 * 60);
        this.endMinDate.setDate(date.getDate() + 1);
      });
    this.userForm
      .get('roomInformation.0')
      ?.get('roomTypeId')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          this.userForm.get('offerId').reset();
          this.getOfferByRoomType(res);
          this.getSummaryData();
        }
      });
    this.userForm
      .get('roomInformation.0.adultCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          this.getSummaryData();
        }
      });
    this.userForm
      .get('roomInformation.0.childCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          this.getSummaryData();
        }
      });
    this.userForm
      .get('roomInformation.0.roomCount')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          if (
            this.userForm.get('roomInformation.0.roomCount').value >
            this.userForm.get('roomInformation.0.adultCount').value
          )
            this.userForm
              .get('roomInformation.0.adultCount')
              .patchValue(
                this.userForm.get('roomInformation.0.roomCount').value
              );
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
          this.reservationTypes.push({ label: 'Cancelled', value: 'CANCELED' });
          this.getReservationDetails();
          this.userForm.valueChanges.subscribe((_) => {
            if (!this.formValueChanges) {
              this.formValueChanges = true;
              this.listenForFormChanges();
            }
          });
        } else
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
        adultCount:
          this.userForm.get('roomInformation.0.adultCount')?.value || 1,
        roomCount: this.userForm.get('roomInformation.0.roomCount')?.value || 1,
        childCount:
          this.userForm.get('roomInformation.0.childCount')?.value || 0,
        roomType: this.userForm.get('roomInformation.0.roomTypeId')?.value,
        offerId: this.userForm.get('offerId')?.value,
        entityId: this.hotelId,
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };
    if (this.userForm.get('roomInformation.0.roomTypeId')?.value)
      this.$subscription.add(
        this.manageReservationService
          .getSummaryData(config)
          .subscribe((res) => {
            this.summaryData = new SummaryData().deserialize(res);
            this.userForm
              .get('roomInformation.0')
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
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `Reservation created Successfully.`,
              priorityMessage: 'Reservation created Successfully.',
            },
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
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `Reservation updated Successfully.`,
              priorityMessage: 'Reservation updated Successfully.',
            },
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
