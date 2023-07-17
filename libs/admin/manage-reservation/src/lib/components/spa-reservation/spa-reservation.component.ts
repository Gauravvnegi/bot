import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
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
import { menuItemFields, spaFields } from '../../constants/reservation';
import { manageBookingRoutes } from '../../constants/routes';
import {
  OfferList,
  OfferData,
  SummaryData,
  ReservationFormData,
  BookingInfo,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-spa-reservation',
  templateUrl: './spa-reservation.component.html',
  styleUrls: ['./spa-reservation.component.scss', '../reservation.styles.scss'],
})
export class SpaReservationComponent implements OnInit {
  userForm: FormGroup;
  spaBookingInfo: FormArray;
  fields: IteratorField[];

  entityId: string;
  reservationId: string;

  statusOptions: Option[] = [];

  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;

  // loading = false;
  formValueChanges = false;
  disabledForm = false;

  date: string;
  time: string;

  deductedAmount = 0;
  bookingType = 'SPA';

  pageTitle: string;
  routes: NavRouteOptions = [];

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService
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
    this.entityId = this.globalFilterService.entityId;
    this.fields = spaFields;
    this.initOptions();
    this.getReservationId();
  }

  initOptions() {
    this.statusOptions = [
      { label: 'Confirmed', value: 'CONFIRMED' },
      { label: 'Waitlist', value: 'WAITLIST' },
      { label: 'Draft', value: 'DRAFT' },
    ];
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.spaBookingInfo = this.fb.array([]);

    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        dateAndTime: ['', Validators.required],
        status: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      bookingInformation: this.fb.group({
        numberOfAdults: ['', Validators.required],
        menuItems: this.spaBookingInfo,
      }),
      offerId: [''],
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formService.reservationDateAndTime.subscribe((res) => {
      if (res) this.setDateAndTime(res);
    });
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
      // this.reservationTypes = [
      //   { label: 'Draft', value: 'DRAFT' },
      //   { label: 'Confirmed', value: 'CONFIRMED' },
      //   { label: 'Cancelled', value: 'CANCELED' },
      // ];
      this.getReservationDetails();
    } else {
      // this.reservationTypes = [
      //   { label: 'Draft', value: 'DRAFT' },
      //   { label: 'Confirmed', value: 'CONFIRMED' },
      // ];
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
        type: 'ROOM_TYPE',
        fromDate: this.userForm.get('reservationInformation.from')?.value,
        toDate: this.userForm.get('reservationInformation.to')?.value,
        adultCount: this.userForm.get('roomInformation.adultCount')?.value || 1,
        roomCount: this.userForm.get('roomInformation.roomCount')?.value || 1,
        childCount: this.userForm.get('roomInformation.childCount')?.value || 0,
        roomType: this.userForm.get('roomInformation.roomTypeId')?.value,
        offerId: this.userForm.get('offerId')?.value,
        entityId: this.entityId,
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

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
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
