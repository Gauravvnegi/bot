import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  AdminUtilityService,
  CountryCode,
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
  countries = new CountryCode().getByLabelAndValue();
  summaryData: SummaryData;
  roomFields = roomFields;
  reservationTypes = Reservation.reservationTypes;
  bookingSources = Reservation.bookingSources;
  marketSegments = Reservation.marketSegments;

  displayBookingOffer: boolean = false;
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
    protected activatedRoute: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
    this.listenForFormChanges();
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
        sourceName: ['', Validators.required],
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
        phoneNumber: ['', Validators.required],
      }),
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        city: ['', Validators.required],
        countryCode: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
      }),
      paymentMethod: this.fb.group({
        totalPaidAmount: ['', Validators.required],
        paymentMethod: ['', Validators.required],
        paymentRemark: [''],
      }),
      offerId: [''],
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
    this.userForm.get('roomInformation').valueChanges.subscribe((res) => {
      const data = this.roomTypes.filter(
        (item) =>
          item.value === this.userForm.get('roomInformation.0.roomTypeId').value
      );
      if (this.userForm.get('roomInformation.0.roomTypeId').dirty) {
        this.userForm.get('offerId').reset();
        this.getOfferByRoomType(data[0]?.value);
        this.getSummaryData();
      }
      if (
        this.userForm.get('roomInformation.0.roomCount')?.value >
        data[0]?.roomCount
      ) {
        this.userForm
          .get('roomInformation.0.roomCount')
          .patchValue(data[0]?.roomCount);
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
          this.getReservationDetails();
        }
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
        adultCount: this.userForm.get('roomInformation.0.adultCount')?.value,
        roomCount: this.userForm.get('roomInformation.0.roomCount')?.value,
        childCount: this.userForm.get('roomInformation.0.childCount')?.value,
        roomType: this.userForm.get('roomInformation.0.roomTypeId')?.value,
        offerId: this.userForm.get('offerId')?.value,
        entityId: this.hotelId,
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };
    this.$subscription.add(
      this.manageReservationService.getSummaryData(config).subscribe((res) => {
        this.summaryData = new SummaryData().deserialize(res);
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
