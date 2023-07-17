import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { manageBookingRoutes } from '../../constants/routes';
import {
  BookingInfo,
  OfferData,
  OfferList,
  ReservationFormData,
  SummaryData,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  AdminUtilityService,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { roomFields } from '../../constants/reservation';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss', '../reservation.styles.scss'],
})
export class AddReservationComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  entityId: string;
  reservationId: string;
  globalQueries = [];

  reservationTypes: Option[] = [];
  roomNumbers: Option[] = [];
  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;
  fields = roomFields;
  // loading = false;
  formValueChanges = false;
  disabledForm = false;
  expandAccordion = false;

  deductedAmount = 0;
  bookingType = 'HOTEL';

  pageTitle = 'Add Booking';
  routes: NavRouteOptions = [];

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.entityId = this.globalFilterService.entityId;
    this.initDetails();
    this.getReservationId();
  }

  initDetails() {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.expandAccordion = this.formService.enableAccordion;
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }
    const { navRoutes, title } = manageBookingRoutes[
      this.reservationId ? 'editBooking' : 'addBooking'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        reservationType: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      offerId: [''],
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formValueChanges = true;
    this.roomControls[0].get('roomTypeId')?.valueChanges.subscribe((res) => {
      if (res) {
        this.userForm.get('offerId').reset();
        this.getOfferByRoomType(res);
        this.getSummaryData();
      }
    });
    this.roomControls[0].get('roomCount')?.valueChanges.subscribe((res) => {
      if (res) {
        if (
          this.roomControls[0].get('roomCount').value >
          this.roomControls[0].get('adultCount').value
        )
          this.roomControls[0]
            .get('adultCount')
            .patchValue(this.roomControls[0].get('roomCount').value);
      }
    });
  }

  getReservationId(): void {
    if (this.reservationId) {
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
                this.roomControls[0].get('roomTypeId').value
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
        type: 'ROOM_TYPE',
        fromDate: this.userForm.get('reservationInformation.from')?.value,
        toDate: this.userForm.get('reservationInformation.to')?.value,
        adultCount: this.roomControls[0].get('adultCount')?.value || 1,
        roomCount: this.roomControls[0].get('roomCount')?.value || 1,
        childCount: this.roomControls[0].get('childCount')?.value || 0,
        roomType: this.roomControls[0].get('roomTypeId')?.value,
        offerId: this.userForm.get('offerId')?.value,
        entityId: this.entityId,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };
    if (this.roomControls[0].get('roomTypeId')?.value) {
      this.$subscription.add(
        this.manageReservationService.getSummaryData(config).subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            this.fields[2].options = this.summaryData?.roomNumbers;
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

  get roomControls() {
    return ((this.userForm.get('roomInformation') as FormGroup).get(
      'roomTypes'
    ) as FormArray).controls;
  }
}
