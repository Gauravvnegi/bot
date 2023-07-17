import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  NavRouteOptions,
  AdminUtilityService,
  Option,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { manageBookingRoutes } from '../../constants/routes';
import {
  OfferList,
  OfferData,
  SummaryData,
  ReservationFormData,
  BookingInfo,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { menuItemFields } from '../../constants/reservation';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';

@Component({
  selector: 'hospitality-bot-restaurant-reservation',
  templateUrl: './restaurant-reservation.component.html',
  styleUrls: [
    './restaurant-reservation.component.scss',
    '../reservation.styles.scss',
  ],
})
export class RestaurantReservationComponent implements OnInit {
  userForm: FormGroup;
  menuItemsArray: FormArray;
  fields: IteratorField[];

  entityId: string;
  reservationId: string;

  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];

  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;

  // loading = false;
  formValueChanges = false;
  disabledForm = false;
  expandAccordion = false;

  date: string;
  time: string;
  deductedAmount = 0;
  bookingType = 'RESTAURANT';

  pageTitle: string;
  routes: NavRouteOptions = [];

  // summaryInfo: SummaryInfo;
  tableNumber = '';
  numberOfAdults = '';
  price = 0;
  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formSerivce: FormService,
    private outletService: OutletService
  ) {
    this.initForm();
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');

    const { navRoutes, title } = manageBookingRoutes[
      this.reservationId ? 'editBooking' : 'addBooking'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.initDetails();
    this.entityId = this.globalFilterService.entityId;
    this.fields = menuItemFields;
    this.initOptions();
    this.getReservationId();
  }

  initDetails() {
    this.entityId = this.globalFilterService.entityId;
    this.fields = menuItemFields;
    this.expandAccordion = this.formSerivce.enableAccordion;
    if (this.expandAccordion) {
      this.formSerivce.enableAccordion = false;
    }
    // this.setDateAndTime(this.reservationInfoControls.dateAndTime.value);
  }

  initOptions() {
    this.reservationTypes = [
      { label: 'Dine-in', value: 'DINE_IN' },
      { label: 'Delivery', value: 'Delivery' },
    ];
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.menuItemsArray = this.fb.array([]);

    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        dateAndTime: ['', Validators.required],
        reservationType: ['', Validators.required],
        status: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      orderInformation: this.fb.group({
        tableNumber: ['', Validators.required],
        numberOfAdults: ['', Validators.required],
        menuItems: this.menuItemsArray,
        kotInstructions: [''],
      }),
      offerId: [''],
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.inputControl.orderInformation.valueChanges.subscribe((res) => {
      this.numberOfAdults = `For ${res?.numberOfAdults} Adults`;
      this.tableNumber = `Table Number: ${res?.tableNumber}`;
    });
    // this.reservationInfoControls.dateAndTime.valueChanges.subscribe((res) => {
    //   this.setDateAndTime(res);
    // });
    this.formSerivce.reservationDateAndTime.subscribe((res) => {
      if (res) this.setDateAndTime(res);
    });

    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        if (res === 'NOSHOW' || res === 'CANCELLED') {
          this.orderInfoControls.tableNumber.disable();
          this.orderInfoControls.numberOfAdults.disable();
        } else {
          this.orderInfoControls.numberOfAdults.enable();
          this.orderInfoControls.tableNumber.enable();
        }
      }
    );
  }

  setDateAndTime(dateTime: number) {
    const dateAndTime = new Date(dateTime);
    const date = dateAndTime.toLocaleDateString();
    const time = dateAndTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    // Update template variables
    this.date = date;
    this.time = time;
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.statusOptions = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Confirmed', value: 'CONFIRMED' },
        { label: 'Waitlisted', value: 'WAITLISTED' },
        { label: 'Cancelled', value: 'CANCELLED' },
        { label: 'No Show', value: 'NOSHOW' },
        { label: 'Seated', value: 'SEATED' },
        { label: 'Completed', value: 'COMPLETED' },
      ];
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Confirmed', value: 'CONFIRMED' },
        { label: 'Waitlisted', value: 'WAITLISTED' },
        { label: 'Seated', value: 'SEATED' },
        { label: 'Completed', value: 'COMPLETED' },
      ];
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
        .getReservationDataById(this.reservationId, this.entityId)
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
          .getOfferByRoomType(this.entityId, id)
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
        type: 'RESTAURANT',
        // fromDate: this.userForm.get('reservationInformation.from')?.value,
        // toDate: this.userForm.get('reservationInformation.to')?.value,
        // adultCount: this.userForm.get('roomInformation.adultCount')?.value || 1,
        // roomCount: this.userForm.get('roomInformation.roomCount')?.value || 1,
        // childCount: this.userForm.get('roomInformation.childCount')?.value || 0,
        // roomType: this.userForm.get('roomInformation.roomTypeId')?.value,
        // offerId: this.userForm.get('offerId')?.value,
        // entityId: this.entityId,
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };

    const data = {
      dateAndTime: this.reservationInfoControls.dateAndTime.value,
      adultCount: this.orderInfoControls.numberOfAdults.value,
      items: [
        {
          itemId: '7dcc88bc-6785-4d5d-97a8-9bfef5b2fecf',
          unit: 23,
          amount: 2.8,
        },
      ],
      outletType: 'RESTAURANT',
    };
    if (this.userForm.get('roomInformation.roomTypeId')?.value) {
      this.$subscription.add(
        this.manageReservationService.getSummaryData(this.entityId, data, config).subscribe(
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

  get inputControl() {
    return this.userForm.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get orderInfoControls() {
    return (this.userForm.get('orderInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['orderInformation'],
      AbstractControl
    >;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
