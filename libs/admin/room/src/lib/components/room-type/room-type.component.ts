import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  DiscountType,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import {
  RoomTypeFormData,
  ServicesTypeValue,
  errorMessages,
  noRecordAction,
  noRecordActionForComp,
} from '../../constant/form';
import routes from '../../constant/routes';
import { Service, Services } from '../../models/amenities.model';
import { RoomTypeForm } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { RatePlanOptions } from '../../types/room';
import { FormService } from '../../services/form.service';
import { RoomType } from '../../models/rooms-data-table.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

@Component({
  selector: 'hospitality-bot-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnDestroy {
  readonly inputValidationProps = { errorMessages, type: 'number' };
  readonly noRecordAction = noRecordAction;
  readonly noRecordActionForComp = noRecordActionForComp;
  currencies: Option[] = [{ label: 'INR', value: 'INR' }];

  subscription$ = new Subscription();

  useForm: FormGroup;
  ratePlanArray: FormArray;

  loading: boolean = false;
  isCompLoading: boolean = false;
  isPaidLoading: boolean = false;
  isPricingDynamic = false;
  disableRoomType = false;

  baseRoomType: RoomType;

  plans: RatePlanOptions[] = [];
  removedRatePlans: string[] = [];
  planCount = 0;

  selectedIndex = 0;
  roomTypeId: string;
  entityId: string;

  defaultRatePlanStatus: boolean = true;

  defaultImage: string = 'assets/images/image-upload.png';
  pageTitle = 'Add Room Type';
  navRoutes: NavRouteOptions = [
    { label: 'efrontdesk', link: './' },
    { label: 'Rooms', link: '/pages/efrontdesk/room' },
    { label: 'Add Room Type', link: './' },
  ];

  /* Dropdown Options */
  paidServices: Service[] = [];
  compServices: Service[] = [];
  discountTypes: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackBarService,
    private formService: FormService,
    private subscriptionPlanService: SubscriptionPlanService,
    private modalService: ModalService
  ) {
    this.roomTypeId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.entityId = this.globalService.entityId;
    this.isPricingDynamic = this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.DYNAMIC_PRICING
    );
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
      imageUrl: [[], [Validators.required]],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], [Validators.required]],
      paidAmenities: [[]],
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

      ratePlans: new FormArray([]),
      isBaseRoomType: [false],
    });

    this.addRatePlanType();

    this.ratePlanArray = this.useForm.get('ratePlans') as FormArray;

    // If Data is already present
    if (this.roomService.roomTypeFormState) {
      this.useForm.patchValue(this.roomService.roomTypeFormData);
    }

    // Patch the form value if service id present
    if (this.roomTypeId) {
      this.initFormDetails();
    } else {
      this.initBaseRoomType();
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
        }
      })
    );

    this.getServices(ServicesTypeValue.PAID);
    this.getServices(ServicesTypeValue.COMPLIMENTARY);
  }

  initBaseRoomType() {
    this.roomService.getBaseRoomType(this.entityId).subscribe((res) => {
      const ratePlanControl = this.isPricingDynamic
        ? this.useForm.get('dynamicRatePlans.basePrice')
        : this.useForm.get('staticRatePlans.basePrice');

      if (res.length) {
        ratePlanControl.setValue(res[0].pricingDetails.base);
      } else {
        this.useForm.get('isBaseRoomType').setValue(true);
        ratePlanControl.enable();
      }
    });
  }

  addRatePlanType() {
    if (this.isPricingDynamic)
      this.useForm.addControl(
        'dynamicRatePlans',
        this.fb.group({
          label: [
            'EP (Room Only)',
            [Validators.required, Validators.maxLength(60)],
          ],
          basePriceCurrency: ['INR', [Validators.required]],
          basePrice: [
            { value: '', disabled: true },
            [Validators.required, Validators.min(0)],
          ],
          price: ['', [Validators.required, Validators.min(0)]],
          minPriceCurrency: ['INR', [Validators.required]],
          minPrice: ['', [Validators.required, Validators.min(0)]],
          maxPriceCurrency: ['INR', [Validators.required]],
          maxPrice: ['', [Validators.min(0)]],
          doubleOccupancyPrice: ['', [Validators.min(0)]],
          tripleOccupancyCurrency: ['INR', [Validators.required]],
          doubleOccupancyCurrency: ['INR', [Validators.required]],
          tripleOccupancyPrice: ['', [Validators.min(0)]],
          paxPriceCurrency: ['INR', [Validators.required]],
          paxAdultPrice: ['', [Validators.required, Validators.min(0)]],
          paxChildPrice: ['', [Validators.required, Validators.min(0)]],
          paxChildBelowFive: ['', [Validators.required, Validators.min(0)]],
          ratePlanId: [''],
          status: [true],
        })
      );
    else
      this.useForm.addControl(
        'staticRatePlans',
        this.fb.group({
          label: [
            'EP (Room Only)',
            [Validators.required, Validators.maxLength(60)],
          ],
          basePriceCurrency: ['INR', [Validators.required]],
          basePrice: ['', [Validators.required, Validators.min(0)]],
          price: ['', [Validators.required, Validators.min(0)]],
          discountType: ['PERCENTAGE'],
          discountValue: ['', [Validators.required, Validators.min(0)]],
          doubleOccupancyPrice: ['', [Validators.min(0)]],
          doubleOccupancyCurrency: ['INR', [Validators.required]],
          tripleOccupancyCurrency: ['INR', [Validators.required]],
          tripleOccupancyPrice: ['', [Validators.min(0)]],
          bestPriceCurrency: ['INR', [Validators.required]],
          bestAvailablePrice: ['', [Validators.required, Validators.min(0)]],
          paxPriceCurrency: ['INR', [Validators.required]],
          paxAdultPrice: ['', [Validators.required, Validators.min(0)]],
          paxChildPrice: ['', [Validators.required, Validators.min(0)]],
          paxChildBelowFive: ['', [Validators.required, Validators.min(0)]],
          ratePlanId: [''],
          status: [true],
        })
      );
  }

  initFormDetails() {
    this.pageTitle = 'Update Room Type';
    this.navRoutes[2].label = 'Update Room Type';

    if (!this.roomService.roomTypeFormState) {
      this.subscription$.add(
        this.roomService
          .getRoomTypeById(this.entityId, this.roomTypeId)
          .subscribe(
            (res) => {
              let data = new RoomTypeForm().deserialize(res);
              const { staticRatePlans, dynamicRatePlans, ...rest } = data;
              this.disableRoomType = data.isBaseRoomType;
              if (this.isPricingDynamic) {
                this.useForm
                  .get('dynamicRatePlans')
                  .patchValue(dynamicRatePlans);
                this.defaultRatePlanStatus = dynamicRatePlans.status;
              } else {
                this.useForm.get('staticRatePlans').patchValue(staticRatePlans);
                this.defaultRatePlanStatus = dynamicRatePlans.status;
              }

              data.ratePlans.forEach(() => {
                this.addNewRatePlan();
              });
              this.useForm.patchValue(data, { emitEvent: false });
            },
            (err) => {
              this.snackbarService.openSnackBarAsText(err.error.message);
            }
          )
      );
    }
  }

  /**
   * Handle remove rate plan based on index
   */
  removeRatePlan(index: number): void {
    const removedPlan = this.ratePlanArray.at(index).get('ratePlanId').value;
    this.removedRatePlans.push(removedPlan);
    this.ratePlanArray.removeAt(index);
  }

  /**
   * @function addNewRatePlan Adds new rate plan array based on pricing type
   */
  addNewRatePlan(id?: string, label?: string) {
    const addedRatePlan = {
      label: ['', [Validators.required, Validators.maxLength(60)]],
      currency: ['INR', [Validators.required]],
      extraPrice: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      ratePlanId: [''],
      status: [true],
    };

    this.ratePlanArray.push(this.fb.group(addedRatePlan));
  }

  // initBaseRoomTypeDetails() {
  //   const ratePlanFormGroup = this.isPricingDynamic
  //     ? (this.useForm.get('dynamicRatePlans') as FormGroup)
  //     : (this.useForm.get('staticRatePlans') as FormGroup);

  //   const basePrice = this.baseRoomType.price ?? 0;
  //   if (basePrice) {
  //     ratePlanFormGroup.get('basePrice').setValue(basePrice);
  //     ratePlanFormGroup.get('basePrice').disable();
  //   }
  // }

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
        .getServices(this.entityId, {
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
    this.router.navigate(['/pages/efrontdesk/room/add-room-type/services']);
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

    if (serviceType === 'PAID') {
      this.router.navigate(['pages/library/services/create-service']);
    } else {
      this.router.navigate([
        'pages/efrontdesk/room/add-room-type/import-services',
      ]);
    }
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
    const data = this.useForm.getRawValue() as RoomTypeFormData;

    const modifiedData = this.formService.getRoomTypeModData(
      data,
      this.isPricingDynamic
    );
    this.subscription$.add(
      this.roomService.createRoomType(this.entityId, modifiedData).subscribe(
        (res) => {
          this.loading = false;
          this.router.navigate([`/pages/efrontdesk/room/${routes.dashboard}`]);
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
    const data = this.useForm.getRawValue() as RoomTypeFormData;
    const modifiedData = {
      ...this.formService.getRoomTypeModData(data, this.isPricingDynamic),
      removeRatePlan: this.removedRatePlans,
      id: this.roomTypeId,
    };
    const roomTypeData = {
      roomType: modifiedData,
    };
    this.subscription$.add(
      this.roomService.updateRoomType(this.entityId, roomTypeData).subscribe(
        (res) => {
          this.loading = false;
          this.router.navigate([`/pages/efrontdesk/room/${routes.dashboard}`]);
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

  onToggleSwitch(isToogleOn: boolean, index?: number) {
    if (!index && index !== 0) {
      this.isPricingDynamic
        ? this.useForm.get('dynamicRatePlans.status').setValue(isToogleOn)
        : this.useForm.get('staticRatePlans.status').setValue(isToogleOn);
      return;
    }
    this.ratePlanArray.at(index).get('status').setValue(isToogleOn);
  }

  onRoomTypeToggleSwitch(isToggleOn: boolean) {
    const ratePlanControl = this.isPricingDynamic
      ? this.useForm.get('dynamicRatePlans.basePrice')
      : this.useForm.get('staticRatePlans.basePrice');

    this.useForm.get('isBaseRoomType').setValue(isToggleOn);

    if (isToggleOn) {
      // const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      // const togglePopupCompRef = this.modalService.openDialog(
      //   ModalComponent,
      //   dialogConfig
      // );

      // togglePopupCompRef.componentInstance.content = {
      //   heading: 'In-active Room Type',
      //   description: [
      //     'You are about to mark this room type in-active.',
      //     'Are you Sure?',
      //   ],
      // };
      // togglePopupCompRef.componentInstance.actions = [
      //   {
      //     label: 'No',
      //     onClick: () => this.modalService.close(),
      //     variant: 'outlined',
      //   },
      //   {
      //     label: 'Yes',
      //     onClick: () => {
      //       this.useForm.get('isBaseRoomType').setValue(isToggleOn);
      //       this.modalService.close();
      //     },
      //     variant: 'contained',
      //   },
      // ];

      // togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      //   this.modalService.close();
      // });
      ratePlanControl.enable();
    } else {
      ratePlanControl.disable();
    }
  }

  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
