import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  NavRouteOptions,
  AdminUtilityService,
  Regex,
  Option,
} from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { Subscription } from 'rxjs';
import { menuItemFields } from '../../constants/reservation';
import { manageReservationRoutes } from '../../constants/routes';
import {
  OfferList,
  OfferData,
  SummaryData,
  ReservationFormData,
  BookingInfo,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';

@Component({
  selector: 'hospitality-bot-venue-reservation',
  templateUrl: './venue-reservation.component.html',
  styleUrls: [
    './venue-reservation.component.scss',
    '../reservation.styles.scss',
  ],
})
export class VenueReservationComponent implements OnInit {
  userForm: FormGroup;
  venueBookingInfo: FormArray;
  fields: IteratorField[];

  hotelId: string;
  reservationId: string;

  statusOptions: Option[] = [];
  eventOptions: Option[] = [];

  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;

  // loading = false;
  formValueChanges = false;
  disabledForm = false;

  deductedAmount = 0;
  bookingType = 'VENUE';

  pageTitle = 'Add Reservation';
  routes: NavRouteOptions = [];

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.initForm();
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');

    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.fields = menuItemFields;
    this.initOptions();
    this.getReservationId();
  }

  initOptions() {
    this.statusOptions = [
      { label: 'Confirmed', value: 'CONFIRMED' },
      { label: 'Waitlist', value: 'WAITLIST' },
      { label: 'Draft', value: 'DRAFT' },
    ];
    this.eventOptions = [
      { label: 'Anniversary', value: 'ANNIVERSARY'},
      { label: 'Birthday', value: 'BIRTHDAY'},
      { label: 'Wedding', value: 'WEDDING'},
      { label: 'Conference', value: 'CONFERENCE'},
      { label: 'Exhibition', value: 'EXHIBITION'},
      { label: 'Seminar', value: 'SEMINAR'},
    ]
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.venueBookingInfo = this.fb.array([]);

    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        status: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
        eventType: ['', [Validators.required]],
      }),
      bookingInformation: this.fb.group({
        menuItems: this.venueBookingInfo,
      }),
      guestInformation: this.fb.group({
        guestDetails: [''],
      }),
      instructions: this.fb.group({
        specialInstructions: [''],
      }),
      address: this.fb.group({
        addressLine1: ['', [Validators.required]],
        city: ['', [Validators.required]],
        countryCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
      }),
      paymentRule: this.fb.group({
        amountToPay: [0],
        deductedAmount: [''],
        makePaymentBefore: [''],
        inclusionsAndTerms: [''],
      }),
      paymentMethod: this.fb.group({
        cashierFirstName: [{ value: '', disabled: true }],
        cashierLastName: [{ value: '', disabled: true }],
        totalPaidAmount: [
          '',
          [Validators.pattern(Regex.DECIMAL_REGEX), Validators.min(1)],
        ],
        currency: [''],
        paymentMethod: [''],
        paymentRemark: ['', [Validators.maxLength(60)]],
        transactionId: [''],
      }),
      offerId: [''],
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

  getReservationId(): void {
    if (this.reservationId) {
      this.getReservationDetails();
    } else {
      this.userForm.valueChanges.subscribe((_) => {
        if (!this.formValueChanges) {
          this.formValueChanges = true;
          this.listenForFormChanges();
        }
      });
    }
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
            this.setFormDisability(data.reservationInformation);
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
    this.userForm.get('reservationInformation.source').disable();
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
        fromDate: this.userForm.get('reservationInformation.from')?.value,
        toDate: this.userForm.get('reservationInformation.to')?.value,
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
    if (this.userForm.get('roomInformation.roomTypeId')?.value) {
      this.$subscription.add(
        this.manageReservationService.getSummaryData(config).subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            this.userForm
              .get('roomInformation')
              .patchValue(this.summaryData, { emitEvent: false });
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .setValidators([Validators.max(this.summaryData?.totalAmount)]);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .updateValueAndValidity();
            this.userForm
              .get('paymentRule.deductedAmount')
              .patchValue(this.summaryData?.totalAmount);
            this.deductedAmount = this.summaryData?.totalAmount;
          },
          (error) => {}
        )
      );
    }
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
