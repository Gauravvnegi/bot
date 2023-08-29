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
  AdminUtilityService,
  Option,
  EntityType,
  EntitySubType,
} from '@hospitality-bot/admin/shared';
import {
  editModeStatusOptions,
  eventOptions,
  statusOptions,
  venueFields,
} from '../../constants/reservation';
import {
  SummaryData,
  ReservationFormData,
  BookingInfo,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationForm } from '../../constants/form';
import { BaseReservationComponent } from '../base-reservation.component';
import { FormService } from '../../services/form.service';
import { ReservationType } from '../../constants/reservation-table';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-venue-reservation',
  templateUrl: './venue-reservation.component.html',
  styleUrls: [
    './venue-reservation.component.scss',
    '../reservation.styles.scss',
  ],
})
export class VenueReservationComponent extends BaseReservationComponent
  implements OnInit {
  venueBookingInfo: FormArray;
  foodPackageArray: FormArray;

  statusOptions: Option[] = [];
  eventOptions: Option[] = [];
  foodPackages: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {
    super(globalFilterService, activatedRoute);
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    this.getReservationId();
    this.listenForFormChanges();
  }

  initDetails() {
    this.bookingType = EntitySubType.VENUE;
    this.fields = venueFields;
    this.eventOptions = eventOptions;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.venueBookingInfo = this.fb.array([]);
    this.foodPackageArray = this.fb.array([]);

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
      eventInformation: this.fb.group({
        numberOfAdults: ['', Validators.required],
        foodPackages: new FormArray([]),
        venueInfo: this.venueBookingInfo,
      }),
      offerId: [''],
    });
    // Add food package items to the form
    this.foodPackageArray = this.userForm.get(
      'eventInformation.foodPackages'
    ) as FormArray;

    // Add the first food package item to the form
    this.foodPackageArray.push(this.createFoodPackageItem());
  }

  createFoodPackageItem(): FormGroup {
    return this.fb.group({
      type: [''],
      count: [''],
    });
  }

  addFoodPackageItem(): void {
    this.foodPackageArray.push(this.createFoodPackageItem());
  }

  removeFoodPackageItem(index: number): void {
    this.foodPackageArray.removeAt(index);
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.inputControls.eventInformation.valueChanges
      .pipe(debounceTime(100))
      .subscribe((res) => {
        this.getSummaryData();
      });
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.statusOptions = [
        ...statusOptions,
        { label: 'In Progress', value: 'IN_PROGRESS' },
      ];
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...editModeStatusOptions,
        { label: 'In Progress', value: 'IN_PROGRESS' },
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
          },
          (error) => {}
        )
    );
  }

  setFormDisability(): void {
    // this.userForm.get('reservationInformation.source').disable();
    if (this.reservationId) {
      const reservationType = this.reservationInfoControls.status.value;
      switch (true) {
        case reservationType === ReservationType.CONFIRMED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
        case reservationType === ReservationType.CANCELED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
        // case data.source === 'CREATE_WITH':
        //   this.disabledForm = true;
        //   break;
        // case data.source === 'OTHERS':
        //   this.disabledForm = true;
        //   break;
      }
    }
  }

  getSummaryData(): void {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        { type: EntityType.OUTLET },
      ]),
    };
    const data = {
      fromDate: this.reservationInfoControls.from.value,
      toDate: this.reservationInfoControls.to.value,
      adultCount: this.eventInfoControls.numberOfAdults.value,
    };
    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.entityId, data, config)
        .subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
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
          (error) => {},
          () => this.setFormDisability()
        )
    );
  }

  get eventInfoControls() {
    return (this.userForm.get('eventInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['eventInformation'],
      AbstractControl
    >;
  }
}
