import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { LibraryItem, LibrarySearchItem } from '@hospitality-bot/admin/library';
import {
  ConfigService,
  DiscountType,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ServicesTypeValue } from 'libs/admin/room/src/lib/constant/form';
import { ServiceList } from 'libs/admin/services/src/lib/models/services.model';
import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { Subscription } from 'rxjs';
import { errorMessages } from '../../constant/packages';
import { PackagesService } from '../../services/packages.service';
import { PackageData, PackageFormData } from '../../types/package';
import { PackageResponse } from '../../types/response';
import { packagesRoutes } from '../../constant/routes';

type ServiceItemOption = Option & { price: number };

@Component({
  selector: 'hospitality-bot-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss'],
})
export class CreatePackageComponent implements OnInit {
  readonly errorMessages = errorMessages;

  packageId: string;
  entityId: string;
  useForm: FormGroup;
  code: string = '# will be auto generated';

  pageTitle = 'Create Package';
  navRoutes: NavRouteOptions;

  loading = false;
  $subscription = new Subscription();

  /* categories options variable */
  categoryOffSet = 0;
  loadingCategory = false;
  noMoreCategories = false;

  /* service options variable */
  servicesOffSet = 0;
  servicesLimit = 20;
  loadingServices = false;
  noMoreServices = false;

  // ** All the dropdown value to be from configuration api **

  categories: Option[] = [];
  services: ServiceItemOption[] = [];
  currencies: Option[];
  discountType: Option[] = [];
  visibilities: Option[] = [];

  selectedServicePrice: Record<string, number> = {};
  selectedPackage: Option;

  startMinDate = new Date();
  endMinDate = new Date();

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private packagesService: PackagesService,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService
  ) {
    this.packageId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = packagesRoutes[
      this.packageId ? 'editPackage' : 'createPackage'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initOptionsConfig();
    this.initNavRoutes();
    this.listenForFormData();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      parentId: ['', Validators.required],
      categoryName: [''],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      serviceIds: [
        [],
        [Validators.required, CustomValidators.minArrayValueLength(2)],
      ],
      imageUrl: ['', Validators.required],
      currency: ['', Validators.required],
      rate: ['0', [Validators.required, Validators.min(0)]],
      discountType: ['PERCENTAGE', Validators.required],
      discountValue: ['0', [Validators.required, Validators.min(0)]],
      discountedCurrency: ['', Validators.required],
      discountedPrice: ['', Validators.required],
      enableVisibility: [[''], Validators.required],
      enableOnMicrosite: [false],
      priority: ['LOW'],
    });

    const { startDate, endDate } = this.useForm.controls;

    startDate.valueChanges.subscribe((res) => {
      this.endMinDate = new Date(res);
      if (endDate.value && startDate.value > endDate.value) {
        endDate.setValue(startDate.value);
      }
    });

    /* Patch the form value if serv id present */
    if (this.packageId && !this.packagesService?.packageFormData?.value) {
      this.$subscription.add(
        this.packagesService
          .getLibraryItemById<PackageResponse>(this.entityId, this.packageId, {
            params: `?type=${LibraryItem.package}`,
          })
          .subscribe(
            (res) => {
              const { packageCode, subPackages, imageUrl } = res;
              const currentServices =
                subPackages?.map((item) => {
                  let price = item.rate;
                  return {
                    label: `${item.name} ${
                      price ? `[${item.currency} ${price}]` : ''
                    }`,
                    value: item.id,
                    price,
                  };
                }) ?? [];

              this.code = packageCode;
              this.selectedPackage = {
                label: res?.categoryName,
                value: res?.parentId,
              };
              currentServices.forEach((item) => {
                if (
                  this.services.findIndex(
                    (service) => service.value === item.value
                  ) === -1
                ) {
                  this.services.push(item);
                  this.selectedServicePrice[item.value] = item.price;
                }
              });
              let images;
              if (imageUrl && imageUrl.length > 0) {
                images = imageUrl[0].url;
              }
              this.useForm.patchValue({ ...res, imageUrl: images });

              this.useForm.get('serviceIds').setValue(
                currentServices.map((item) => item.value),
                { emitEvent: false }
              );
            },
            this.handleError,
            this.handleFinal
          )
      );
    }

    /* Value changes subscription */
    this.initFormSubscription();
  }

  /**
   * to patch value from service which are saved during route change
   */
  listenForFormData() {
    const formData = this.packagesService?.packageFormData?.value;
    if (formData) {
      this.useForm.patchValue(formData);
      this.useForm.markAsDirty();
      this.packagesService.packageFormData.next(null);
    }
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  /**
   * @function initOptionsConfig To get all the dropdown options
   */
  initOptionsConfig() {
    const modOption = ({ key, value }) => ({ label: value, value: key });
    this.configService.$config.subscribe((value) => {
      if (value) {
        const {
          currencyConfiguration,
          packageVisibility,
          roomDiscountConfig,
        } = value;
        this.currencies = currencyConfiguration.map(modOption);
        this.visibilities = packageVisibility.map(({ key, value }) => ({
          label: value,
          value: key,
          isDisabled: key === 'ADMIN_PANEL',
          isSelected: key === 'ADMIN_PANEL',
        }));

        this.discountType = roomDiscountConfig.map(({ value }) => ({
          label: DiscountType[value],
          value,
        }));
        this.useForm.get('currency').setValue(this.currencies[0].value);
        this.useForm
          .get('discountedCurrency')
          .setValue(this.currencies[0].value);
      }
    });
    this.getServices();
  }

  /**
   * @function initFormSubscription Initialize the subscription of form value change
   */
  initFormSubscription() {
    this.registerRateAndDiscountChange();
    this.registerServicesSelectedChange();
  }

  /**
   * @function registerServicesSelectedChange To handle rate value [Base price will be based on the service selected]
   */
  registerServicesSelectedChange() {
    this.useForm.get('serviceIds').valueChanges.subscribe((serviceIds) => {
      const totalPrice = serviceIds?.reduce((prev, serviceId) => {
        if (!this.selectedServicePrice[serviceId]) {
          this.selectedServicePrice = {
            ...this.selectedServicePrice,
            [serviceId]: this.services.find((item) => item.value === serviceId)
              ?.price,
          };
        }
        return prev + this.selectedServicePrice[serviceId];
      }, 0);
      this.useForm.get('rate').setValue(totalPrice);
    });
  }

  /**
   * @function registerRateAndDiscountChange Subscribe to rate and discount value subscription to get discounted price
   */
  registerRateAndDiscountChange() {
    const {
      rate,
      discountType,
      discountedCurrency,
      discountValue,
      currency,
    } = this.useForm.controls;

    /**
     * @function setDiscountValueAndErrors To update the discount value
     * @returns error type
     */
    const setDiscountValueAndErrors = () => {
      const price = +rate.value;
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      if (price && type)
        this.useForm.patchValue({
          discountedPrice:
            type === 'FLAT'
              ? price - discount
              : Math.round(
                  (price - (price * discount) / 100 + Number.EPSILON) * 100
                ) / 100,
        });

      if (type === 'FLAT' && discount > price) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount > 100) {
        return 'isPercentError';
      }
    };

    const clearError = () => {
      if (discountValue.value > 0) discountValue.setErrors(null);
    };

    /* Original price Subscription */
    rate.valueChanges.subscribe(() => {
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        rate.setErrors({ isPriceLess: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
    });

    /**
     * @function discountSubscription To handle changes in discount value
     */
    const discountSubscription = () => {
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        discountValue.setErrors({ isDiscountMore: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
    };

    /* Discount Subscription */
    discountValue.valueChanges.subscribe(discountSubscription);
    discountType.valueChanges.subscribe(discountSubscription);

    /* Currency Subscription */
    currency.valueChanges.subscribe((res) => {
      discountedCurrency.setValue(res);
    });
  }

  /**
   * @function getServices to get services options
   */
  getServices() {
    this.loadingServices = true;
    this.$subscription.add(
      this.packagesService
        .getLibraryItems<ServiceListResponse>(this.entityId, {
          params: `?type=SERVICE&offset=${this.servicesOffSet}&limit=${this.servicesLimit}&status=true&serviceType=${ServicesTypeValue.PAID}&visibilitySource=ADMIN_PANEL`,
        })
        .subscribe(
          (res) => {
            const data = new ServiceList()
              .deserialize(res)
              .paidService.map((item) => {
                let price = item.amount;
                return {
                  label: `${item.name} ${
                    price ? `[${item.currency} ${price}]` : ''
                  }`,
                  value: item.id,
                  price,
                };
              });

            this.services = this.getUniqueOptions([...this.services, ...data]);

            this.noMoreServices =
              res.entityStateCounts['ACTIVE'] <= this.servicesLimit;

            this.loadingServices = false;
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function searchServices To search services
   * @param text search text
   */
  searchServices(text: string) {
    if (text) {
      this.loadingServices = true;
      this.packagesService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=${LibrarySearchItem.SERVICE}`,
        })
        .subscribe(
          (res) => {
            this.loadingServices = false;
            const data = res && res[LibrarySearchItem.SERVICE];
            this.services =
              data
                ?.filter((item) => item.active)
                .map((item) => {
                  let price = item.rate;
                  return {
                    label: `${item.name} ${
                      price ? `[${item.currency} ${price}]` : ''
                    }`,
                    value: item.id,
                    price,
                  };
                }) ?? [];
          },
          this.handleError,
          this.handleFinal
        );
    } else {
      this.servicesLimit = 20;
      this.services = [];
      this.getServices();
    }
  }

  /**
   * @function loadMoreServices load more services options
   */
  loadMoreServices() {
    this.servicesLimit = this.servicesLimit + 10;
    this.getServices();
  }

  onCheckboxClick(event: HTMLInputElement) {
    if (event.checked) this.useForm.get('priority').setValue('HIGH');
    else this.useForm.get('priority').setValue('LOW');
  }

  /**
   * @function create Reroute to create service or create package category
   */
  create(path: 'service' | 'category') {
    this.routesConfigService.navigate(
      path === 'category'
        ? {
            subModuleName: ModuleNames.PACKAGES,
            additionalPath: packagesRoutes.createCategory.route,
          }
        : {
            subModuleName: ModuleNames.SERVICES,
            additionalPath: 'create-service',
          }
    );
    //while redirecting to create service page save data to form service
    path === 'service' &&
      this.packagesService.packageFormData.next(this.useForm.getRawValue());
  }

  /**
   * @function handleSubmit To create new service
   */
  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }

    const {
      discountedCurrency,
      imageUrl,
      ...rest
    } = this.useForm.getRawValue() as PackageFormData;

    const { enableVisibility } = rest;
    rest.enableOnMicrosite = enableVisibility.includes('ALL');

    const data = { imageUrl: [{ isFeatured: true, url: imageUrl }], ...rest };
    this.loading = true;
    if (this.packageId) {
      this.$subscription.add(
        this.packagesService
          .updateLibraryItem<Partial<PackageData>, PackageResponse>(
            this.entityId,
            this.packageId,
            {
              ...data,
              type: 'PACKAGE',
              source: 1,
            },
            { params: '?type=PACKAGE' }
          )
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    } else {
      this.$subscription.add(
        this.packagesService
          .createLibraryItem<PackageData, PackageResponse>(this.entityId, {
            ...data,
            type: 'PACKAGE',
            source: 1,
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    }
  }

  resetForm() {
    this.useForm.reset();
  }

  getUniqueOptions(data: ServiceItemOption[]): ServiceItemOption[] {
    const uniqueMap = new Map();

    for (const item of data) {
      uniqueMap.set(item.value, item);
    }

    return Array.from(uniqueMap.values());
  }

  /**
   * @function handleSuccess to handle network success
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Package is ${!this.packageId ? 'created' : 'updated'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.routesConfigService.goBack();
  };

  /**
   * Handle close loading
   */
  closeLoading = () => {
    this.loadingCategory = false;
    this.loadingServices = false;
    this.loading = false;
  };

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.closeLoading();
  };

  handleFinal = () => {
    this.closeLoading();
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
