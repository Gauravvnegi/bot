import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService, DiscountType } from '@hospitality-bot/admin/shared';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import {
  DynamicPricingRatePlan,
  RoomTypeData,
  RoomTypeFormData,
  ServicesTypeValue,
  StaticPricingRatePlan,
  errorMessages,
  noRecordAction,
  noRecordActionForComp,
} from '../../constant/form';
import routes from '../../constant/routes';
import { Service, Services } from '../../models/amenities.model';
import { RoomTypeForm } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { RatePlanOptions } from '../../types/room';
import { RatePlanResponse } from '../../types/service-response';

@Component({
  selector: 'hospitality-bot-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnDestroy {
  readonly inputValidationProps = { errorMessages, type: 'number' };
  readonly noRecordAction = noRecordAction;
  readonly noRecordActionForComp = noRecordActionForComp;

  subscription$ = new Subscription();

  useForm: FormGroup;
  ratePlanArray: FormArray;

  loading: boolean = false;
  isCompLoading: boolean = false;
  isPaidLoading: boolean = false;
  isPricingDynamic = false;

  plans: RatePlanOptions[] = [];
  planCount = 0;

  selectedIndex = 0;
  roomTypeId: string;
  hotelId: string;

  defaultImage: string = 'assets/images/image-upload.png';
  pageTitle = 'Add Room Type';
  navRoutes: NavRouteOptions = [
    { label: 'Inventory', link: './' },
    { label: 'Rooms', link: '/pages/inventory/room' },
    { label: 'Add Room Type', link: './' },
  ];

  /* Dropdown Options */
  paidServices: Service[] = [];
  compServices: Service[] = [];
  currencies: Option[] = [];
  discountTypes: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackBarService
  ) {
    this.roomTypeId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.initForm();
    this.initOptionConfig();
  }

  get inputControl() {
    return this.useForm.controls as Record<
      keyof RoomTypeFormData,
      AbstractControl
    >;
  }

  /**
   * @function initForm Initialize form
   */
  initForm() {
    const occupancyValidation = [
      Validators.required,
      Validators.min(0),
      CustomValidators.notAllowedChr('.'),
    ];

    this.useForm = this.fb.group({
      status: [true],
      name: ['', [Validators.required]],
      imageUrls: [[], [Validators.required]],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], [Validators.required]],
      paidAmenities: [[]],
      currency: ['', [Validators.required, Validators.min(0)]],
      maxOccupancy: [
        null,
        [
          Validators.required,
          Validators.min(1),
          CustomValidators.notAllowedChr('.'),
        ],
      ],
      maxChildren: [{ value: null, disabled: true }, occupancyValidation],
      maxAdult: [{ value: null, disabled: true }, occupancyValidation],
      area: ['', [Validators.required, Validators.min(0)]],

      ratePlan: new FormArray([]),
    });

    this.ratePlanArray = this.useForm.get('ratePlan') as FormArray;

    // If Data is already present
    if (this.roomService.roomTypeFormState) {
      this.useForm.patchValue(this.roomService.roomTypeFormData);
    }

    // Patch the form value if service id present
    if (this.roomTypeId) {
      this.pageTitle = 'Update Room Type';
      this.navRoutes[2].label = 'Update Room Type';

      if (!this.roomService.roomTypeFormState) {
        this.subscription$.add(
          this.roomService
            .getRoomTypeById(this.hotelId, this.roomTypeId)
            .subscribe(
              (res) => {
                this.useForm.patchValue(new RoomTypeForm().deserialize(res));
              },
              (err) => {
                this.snackbarService.openSnackBarAsText(err.error.message);
              }
            )
        );
      }
    }

    /* Value changes subscription */
    this.initFormSubscription();
  }

  /**
   * @function initOptionsConfig To get all the dropdown options
   */
  initOptionConfig() {
    const modOption = ({ key, value }) => ({ label: value, value: key });

    this.subscription$.add(
      this.configService.$config.subscribe((value) => {
        if (value) {
          const {
            currencyConfiguration,
            roomDiscountConfig,
            roomRatePlans,
          } = value;
          this.currencies = currencyConfiguration.map(modOption);
          this.discountTypes = roomDiscountConfig.map(({ value }) => ({
            label: DiscountType[value],
            value,
          }));
          this.useForm.get('currency').setValue(this.currencies[0].value);
          this.getRatePlans(roomRatePlans);
        }
      })
    );

    this.getServices(ServicesTypeValue.PAID);
    this.getServices(ServicesTypeValue.COMPLIMENTARY);
  }

  getRatePlans(ratePlans: RatePlanResponse[]) {
    const plansData = ratePlans.map((option, index) => ({
      label: option.label,
      value: option.id,
      disabled: false,
      isDefault: option.isDefault,
      command: () => this.handleRatePlan(option.id, option.label),
    }));
    this.plans = plansData;
    this.addNewRatePlan();
  }

  /**
   * @function handleRatePlan To handle rate plan dropdown clicks
   */
  handleRatePlan(value: string, label: string, index?: number) {
    const targetIndex = index ?? this.selectedIndex;
    const currentPlan = this.plans.find((plan) => plan.value === value);
    const ratePlanControl = this.ratePlanArray.at(targetIndex);

    // If current plan is disabled then add next enabled plan
    if (!currentPlan.disabled) {
      ratePlanControl.get('ratePlanTypeId').patchValue(value);
      ratePlanControl.get('label').patchValue(label);
    } else {
      const nextEnabledPlan = this.plans.find((plan) => !plan.disabled);
      ratePlanControl.get('ratePlanTypeId').patchValue(nextEnabledPlan.value);
      ratePlanControl.get('label').patchValue(nextEnabledPlan.label);
      nextEnabledPlan.disabled = true;
    }
    this.setDisabled(value);
  }

  /**
   * Disables the rate plan if already added
   */
  setDisabled(value: string) {
    // Currently selected rate plans
    const selectedRatePlans = this.plans.filter((item) => item.value === value);

    const ratePlanIds = this.ratePlanArray.controls.map(
      (control) => control.get('ratePlanTypeId').value
    );

    // Disables currently selected rate plans in the array
    if (ratePlanIds.includes(value)) {
      selectedRatePlans.map((type) => (type.disabled = true));
    }

    // Enables remaining rate plans
    this.plans
      .filter((item) => !ratePlanIds.includes(item.value))
      .map((plan) => (plan.disabled = false));
  }

  /**
   * Handle remove rate plan based on index
   */
  onRemove(value: string, index: number): void {
    const removedPlan = this.ratePlanArray.at(index).get('ratePlanTypeId')
      .value;
    this.ratePlanArray.removeAt(index);
    this.setDisabled(value);
    this.planCount--;
  }

  /**
   * @function addNewRatePlan Adds new rate plan array based on pricing type
   */
  addNewRatePlan() {
    const staticPricing: Record<keyof StaticPricingRatePlan, any> = {
      basePriceCurrency: ['INR'],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      discountType: ['PERCENTAGE'],
      discountValue: ['', [Validators.required, Validators.min(0)]],
      bestRateCurrency: ['INR'],
      bestAvailableRate: ['', [Validators.required, Validators.min(0)]],
      paxPriceCurrency: ['INR'],
      paxPrice: ['', [Validators.required, Validators.min(0)]],
      ratePlanTypeId: [''],
      label: [''],
    };

    const dynamicPricing: Record<keyof DynamicPricingRatePlan, any> = {
      minPriceCurrency: ['INR'],
      minPrice: ['', [Validators.required, Validators.min(0)]],
      maxPriceCurrency: ['INR'],
      maxPrice: ['', [Validators.required, Validators.min(0)]],
      paxPriceCurrency: ['INR'],
      paxPrice: ['', [Validators.required, Validators.min(0)]],
      ratePlanTypeId: [''],
      label: [''],
    };

    let formGroup: FormGroup;
    this.isPricingDynamic
      ? (formGroup = this.fb.group(dynamicPricing))
      : (formGroup = this.fb.group(staticPricing));
    this.ratePlanArray.push(formGroup);

    const ratePlanArrayIndex = this.ratePlanArray.length - 1;
    this.handleRatePlan(
      this.plans[ratePlanArrayIndex].value,
      this.plans[ratePlanArrayIndex].label,
      ratePlanArrayIndex
    );
    this.planCount++;
  }

  /**
   * @function initFormSubscription Initialize the subscription of form value change
   */
  initFormSubscription() {
    this.registerOccupancyChanges();
  }

  /**
   * @function registerOccupancyChanges Subscribe to rate and discount value subscription to get discounted price
   */
  registerOccupancyChanges() {
    const { maxOccupancy, maxChildren, maxAdult } = this.inputControl;
    const doNotEmit = { emitEvent: false };

    const setOccupancyAndError = (
      res: number,
      type: 'maxAdult' | 'maxChildren'
    ) => {
      const isError = +maxOccupancy.value < +res;
      this.useForm.patchValue(
        { [type]: isError ? 0 : maxOccupancy.value - res },
        doNotEmit
      );
      return isError;
    };

    maxOccupancy.valueChanges.subscribe((res) => {
      if (res) {
        maxChildren.enable(doNotEmit);
        maxAdult.enable(doNotEmit);
      } else {
        maxChildren.disable(doNotEmit);
        maxAdult.disable(doNotEmit);
      }
      maxChildren.setValue(null, doNotEmit);
      maxAdult.setValue(null, doNotEmit);
    });

    maxChildren.valueChanges.subscribe((res) => {
      if (setOccupancyAndError(res, 'maxAdult')) {
        maxChildren.setErrors({ maxOccupancy: true });
      }
    });

    maxAdult.valueChanges.subscribe((res) => {
      if (setOccupancyAndError(res, 'maxChildren')) {
        maxAdult.setErrors({ maxOccupancy: true });
      }
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices(serviceType: ServicesTypeValue) {
    this.loading = true;
    this.isCompLoading = true;
    this.isPaidLoading = true;
    this.subscription$.add(
      this.roomService
        .getServices(this.hotelId, {
          params: `?limit=5&type=SERVICE&serviceType=${serviceType}&status=true`,
        })
        .subscribe(
          (res) => {
            if (serviceType == ServicesTypeValue.PAID && res.paidPackages) {
              this.paidServices = new Services().deserialize(
                res.paidPackages
              ).services;
            }
            if (
              serviceType === ServicesTypeValue.COMPLIMENTARY &&
              res.complimentaryPackages
            ) {
              this.compServices = new Services().deserialize(
                res.complimentaryPackages
              ).services;
            }
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
          },
          () => {
            this.loading = false;
            if (serviceType === ServicesTypeValue.COMPLIMENTARY) {
              this.isCompLoading = false;
            }
            if (serviceType === ServicesTypeValue.PAID) {
              this.isPaidLoading = false;
            }
          }
        )
    );
  }

  /**
   *@function saveRoomTypeData Save room type form data that is to be used in services section
   */
  saveRoomTypeData(serviceType) {
    const data = this.useForm.getRawValue();
    this.roomService.initRoomTypeFormData(data, serviceType, true);
    this.router.navigate(['/pages/inventory/room/add-room-type/services']);
  }

  /**
   * @function openImportService Open import service page
   * @description Open import service page and save data locally
   * @param serviceType
   * @returns
   */
  openImportService(serviceType) {
    const data = this.useForm.getRawValue();
    this.roomService.initRoomTypeFormData(
      { ...data, services: this.compServices },
      serviceType,
      true
    );
    this.router.navigate([
      'pages/inventory/room/add-room-type/import-services',
    ]);
  }

  /**
   * @function submitForm handle submission of room type data
   */
  submitForm() {
    if (this.useForm.invalid) {
      this.loading = false;
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    if (!!this.roomTypeId) {
      this.updateDetails();
    } else {
      this.saveDetails();
    }
  }

  saveDetails() {
    const data = this.getRoomTypeModData();
    this.subscription$.add(
      this.roomService.createRoomType(this.hotelId, data).subscribe(
        (res) => {
          this.loading = false;
          this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
          this.snackbarService.openSnackBarAsText(
            'Room type is created successfully',
            '',
            { panelClass: 'success' }
          );
        },
        (error) => {
          this.snackbarService.openSnackBarAsText(error.error.message);
          this.loading = false;
        }
      )
    );
  }

  updateDetails() {
    const data = {
      ...this.getRoomTypeModData(),
      id: this.roomTypeId,
    };

    this.subscription$.add(
      this.roomService.updateRoomType(this.hotelId, data).subscribe(
        (res) => {
          this.loading = false;
          this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
          this.snackbarService.openSnackBarAsText(
            'Room type is updated successfully',
            '',
            { panelClass: 'success' }
          );
        },
        (error) => {
          this.loading = false;
          this.snackbarService.openSnackBarAsText(error.error.message);
        }
      )
    );
  }

  getRoomTypeModData() {
    const {
      complimentaryAmenities,
      paidAmenities,
      staticRatePlans,
      dynamicRatePlans,
      ...rest
    } = this.useForm.getRawValue() as RoomTypeFormData;

    const staticRatePlanModData = staticRatePlans.map((ratePlan) => {
      const { discountType, discountValue, ...restRatePlan } = ratePlan;
      return {
        ...restRatePlan,
        discount: {
          type: discountType,
          value: discountValue,
        },
      };
    });

    const data: RoomTypeData = {
      ...rest,
      ...(this.isPricingDynamic
        ? { dynamicRatePlans }
        : { staticRatePlanModData }),
      roomAmenityIds: complimentaryAmenities.concat(paidAmenities),
    };

    return data;
  }

  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
