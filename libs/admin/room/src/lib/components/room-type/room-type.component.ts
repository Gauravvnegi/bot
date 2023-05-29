import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
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
  errorMessages,
  noRecordAction,
  RoomTypeFormData,
  ServicesTypeValue,
} from '../../constant/form';
import routes from '../../constant/routes';
import { Service, Services } from '../../models/amenities.model';
import { RoomTypeForm } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'hospitality-bot-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnDestroy {
  readonly inputValidationProps = { errorMessages, type: 'number' };
  readonly noRecordAction = noRecordAction;

  subscription$ = new Subscription();

  useForm: FormGroup;
  loading: boolean = false;
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
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      discountType: ['PERCENTAGE'],
      discountValue: ['0', [Validators.min(0)]],
      discountedPrice: [{ value: '', disabled: true }],
      variablePriceCurrency: [{ value: '', disabled: true }],
      currency: ['', [Validators.required, Validators.min(0)]],
      variableAmount: ['', [Validators.min(0)]],
      discountedPriceCurrency: [{ value: '', disabled: true }],
      maxOccupancy: [null, occupancyValidation],
      maxChildren: [{ value: null, disabled: true }, occupancyValidation],
      maxAdult: [{ value: null, disabled: true }, occupancyValidation],
      area: ['', [Validators.required, Validators.min(0)]],
    });

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
          const { currencyConfiguration, roomDiscountConfig } = value;
          this.currencies = currencyConfiguration.map(modOption);
          this.discountTypes = roomDiscountConfig.map(({ value }) => ({
            label: DiscountType[value],
            value,
          }));
          this.useForm
            .get('variablePriceCurrency')
            .setValue(this.currencies[0].value);
          this.useForm.get('currency').setValue(this.currencies[0].value);
          this.useForm
            .get('discountedPriceCurrency')
            .setValue(this.currencies[0].value);
        }
      })
    );

    this.getServices(ServicesTypeValue.PAID);
    this.getServices(ServicesTypeValue.COMPLIMENTARY);
  }

  /**
   * @function initFormSubscription Initialize the subscription of form value change
   */
  initFormSubscription() {
    this.registerRateAndDiscountChange();
    this.registerOccupancyChanges();
  }

  /**
   * @function registerRateAndDiscountChange Subscribe to rate and discount value subscription to get discounted price
   */
  registerRateAndDiscountChange() {
    const {
      originalPrice,
      discountType,
      discountedPriceCurrency,
      discountValue,
      currency,
      variablePriceCurrency,
    } = this.inputControl;

    /**
     * @function setDiscountValueAndErrors To update the discount value
     * @returns error type
     */
    const setDiscountValueAndErrors = () => {
      const price = +originalPrice.value;
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      if (price)
        this.useForm.patchValue({
          discountedPrice:
            type === 'NUMBER'
              ? price - discount
              : Math.round(
                  (price - (price * discount) / 100 + Number.EPSILON) * 100
                ) / 100,
        });

      if (type === 'NUMBER' && discount > price) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount > 100) {
        return 'isPercentError';
      }

      if (discount < 0) {
        return 'isMinError';
      }
    };

    const clearError = () => {
      originalPrice.setErrors(null);
      discountValue.setErrors(null);
    };

    /* Original price Subscription */
    originalPrice.valueChanges.subscribe(() => {
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        originalPrice.setErrors({ isPriceLess: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
      if (originalPrice.value < 0) {
        originalPrice.setErrors({ min: true });
      }
    });

    /**
     * @function discountSubscription To handle changes in discount value
     */
    const discountSubscription = () => {
      discountValue.enable({ emitEvent: false });
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        discountValue.setErrors({ isDiscountMore: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
      if (error === 'isMinError') {
        discountValue.setErrors({ min: true });
      }
    };

    /* Discount Subscription */
    discountValue.valueChanges.subscribe(discountSubscription);
    discountType.valueChanges.subscribe(discountSubscription);

    /* Currency Subscription */
    currency.valueChanges.subscribe((res) => {
      discountedPriceCurrency.setValue(res);
      variablePriceCurrency.setValue(res);
    });
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
      discountedPriceCurrency,
      variablePriceCurrency,
      ...rest
    } = this.useForm.getRawValue() as RoomTypeFormData;

    const data = {
      ...rest,
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
