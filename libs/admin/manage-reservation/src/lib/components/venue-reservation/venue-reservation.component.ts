import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AdminUtilityService,
  Option,
  EntityType,
  EntitySubType,
  HotelDetailService,
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
  OutletForm,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationForm } from '../../constants/form';
import { BaseReservationComponent } from '../../../../../reservation/src/lib/components/base-reservation.component';
import { FormService } from '../../services/form.service';
import { ReservationType } from '../../constants/reservation-table';
import { debounceTime } from 'rxjs/operators';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

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

  venueItemValues = [];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    protected formService: FormService,
    protected hotelDetailService: HotelDetailService,
    protected routesConfigService: RoutesConfigService
  ) {
    super(activatedRoute, hotelDetailService, formService, routesConfigService);
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    this.formService.getSummary.subscribe((res) => {
      if (this.venueItemsControl.value) this.getSummaryData();
    });
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
      instructions: this.fb.group({
        specialInstructions: [''],
      }),
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
        if (res) {
          this.getSummaryData();
        }
      });
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...statusOptions,
        // { label: 'In Progress', value: 'IN_PROGRESS' },
      ];
    }
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.outletId)
        .subscribe(
          (response) => {
            const data = new OutletForm().deserialize(response);
            const {
              eventInformation: { venueInfo, ...eventInfo },
              guestInformation,
              nextStates,
              ...formData
            } = data;

            if (nextStates)
              this.statusOptions = nextStates.map((item) => ({
                label: convertToTitleCase(item),
                value: item,
              }));

            this.formValueChanges = true;

            this.venueItemValues = venueInfo;
            // this.formService.guestInformation.next(guestInformation.id);

            this.userForm.patchValue({
              bookingInformation: eventInfo,
              ...formData,
            });
          },
          (error) => {}
        )
    );
  }

  getSummaryData(): void {
    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.outletId, this.getFormData(), {
          params: `?type=${EntityType.OUTLET}`,
        })
        .subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            this.updatePaymentData();
            if (this.formValueChanges) {
              this.setFormDisability();
              this.formValueChanges = false;
            }
          },
          (error) => {}
        )
    );
  }

  getFormData() {
    const data = {
      from: this.reservationInfoControls.from.value,
      to: this.reservationInfoControls.to.value,
      adultCount: this.eventInfoControls.numberOfAdults.value,
    };

    return data;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get eventInfoControls() {
    return (this.userForm.get('eventInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['eventInformation'],
      AbstractControl
    >;
  }

  get venueItemsControl() {
    return this.userForm.get('eventInformation') as FormGroup;
  }
}
