import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  Categories,
  LibraryItem,
  LibrarySearchItem,
} from '@hospitality-bot/admin/library';
import { ConfigService, DiscountType } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ServicesTypeValue } from 'libs/admin/room/src/lib/constant/form';
import { ServiceList } from 'libs/admin/services/src/lib/models/services.model';
import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { Subscription } from 'rxjs';
import { errorMessages } from '../../constant/packages';
import routes from '../../constant/routes';
import { PackagesService } from '../../services/packages.service';
import { PackageData, PackageFormData } from '../../types/package';
import { PackageResponse } from '../../types/response';

@Component({
  selector: 'hospitality-bot-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss'],
})
export class CreatePackageComponent implements OnInit {
  readonly errorMessages = errorMessages;

  packageId: string;
  hotelId: string;
  useForm: FormGroup;
  code: string = '# will be auto generated';

  pageTitle = 'Create Package';
  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Packages', link: '/pages/library/packages' },
    { label: 'Create Package', link: './' },
  ];

  loading = false;
  $subscription = new Subscription();

  /* categories options variable */
  categoryOffSet = 0;
  loadingCategory = false;
  noMoreCategories = false;

  /* service options variable */
  servicesOffSet = 0;
  loadingServices = false;
  noMoreServices = false;

  // ** All the dropdown value to be from configuration api **

  categories: Option[] = [];
  services: (Option & { price: number })[] = [];
  currencies: Option[] = [{ label: 'INR', value: 'INR' }];
  discountType: Option[] = [];
  visibilities: Option[] = [];

  selectedServicePrice: Record<string, number> = {};

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private packagesService: PackagesService,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.packageId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.initOptionsConfig();
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
      serviceIds: [
        [],
        [Validators.required, CustomValidators.minArrayValueLength(2)],
      ],
      imageUrl: ['', Validators.required],
      currency: ['INR', Validators.required],
      rate: ['', Validators.required],
      discountType: ['', Validators.required],
      discountValue: ['', [Validators.required, Validators.min(1)]],
      discountedCurrency: ['INR', Validators.required],
      discountedPrice: ['', Validators.required],
      enableVisibility: [[], Validators.required],
    });

    /* Patch the form value if service id present */
    if (this.packageId) {
      this.pageTitle = 'Edit Package';
      this.navRoutes[2].label = 'Edit Package';

      this.$subscription.add(
        this.packagesService
          .getLibraryItemById<PackageResponse>(this.hotelId, this.packageId, {
            params: `?type=${LibraryItem.package}`,
          })
          .subscribe(
            (res) => {
              const { packageCode, subPackages } = res;
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

              currentServices.forEach((item) => {
                if (
                  this.services.findIndex(
                    (service) => service.value === item.value
                  ) > -1
                ) {
                  this.services.push(item);
                  this.selectedServicePrice[item.value] = item.price;
                }
              });

              this.useForm.patchValue({ ...res });

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
        this.visibilities = packageVisibility.map(modOption);

        this.discountType = roomDiscountConfig.map(({ value }) => ({
          label: DiscountType[value],
          value,
        }));
      }
    });

    this.getCategories();
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
    };

    const clearError = () => {
      if (rate.value) rate.setErrors(null);
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
   * @function getCategories to get categories options
   */
  getCategories() {
    this.loadingCategory = true;
    this.$subscription.add(
      this.packagesService
        .getCategories(this.hotelId, {
          params: `?type=PACKAGE_CATEGORY&offset=${this.categoryOffSet}&limit=10&status=true`,
        })
        .subscribe(
          (res) => {
            const data = new Categories().deserialize(res).records;
            this.categories = [...this.categories, ...data];
            this.noMoreCategories = data.length < 10;
            this.patchSelectedCategories();
            this.loadingCategory = false;
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function getServices to get services options
   */
  getServices() {
    this.loadingServices = true;
    this.$subscription.add(
      this.packagesService
        .getLibraryItems<ServiceListResponse>(this.hotelId, {
          params: `?type=SERVICE&offset=${this.servicesOffSet}&limit=10&status=true&serviceType=${ServicesTypeValue.PAID}`,
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

            this.services = [...this.services, ...data];
            this.noMoreServices = data.length < 10;
            this.loadingServices = false;
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function searchCategories To search categories
   * @param text search text
   */
  searchCategories(text: string) {
    if (text) {
      this.loadingCategory = true;
      this.packagesService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${LibrarySearchItem.PACKAGE_CATEGORY}`,
        })
        .subscribe(
          (res) => {
            this.loadingCategory = false;
            const data = res && res[LibrarySearchItem.PACKAGE_CATEGORY];
            this.categories =
              data
                ?.filter((item) => item.active)
                .map((item) => ({
                  label: item.name,
                  value: item.id,
                })) ?? [];
            this.patchSelectedCategories();
          },
          this.handleError,
          this.handleFinal
        );
    } else {
      this.categoryOffSet = 0;
      this.categories = [];
      this.getCategories();
    }
  }

  /**
   * @function searchServices To search services
   * @param text search text
   */
  searchServices(text: string) {
    if (text) {
      this.loadingServices = true;
      this.packagesService
        .searchLibraryItem(this.hotelId, {
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
      this.servicesOffSet = 0;
      this.services = [];
      this.getServices();
    }
  }

  /**
   * @function loadMoreCategories load more categories options
   */
  loadMoreCategories() {
    this.categoryOffSet = this.categoryOffSet + 10;
    this.getCategories();
  }

  /**
   * @function loadMoreServices load more services options
   */
  loadMoreServices() {
    this.servicesOffSet = this.servicesOffSet + 10;
    this.getServices();
  }

  /**
   *@function patchSelectedCategories To Patch the selected Category in Options
   */
  patchSelectedCategories() {
    if (this.packageId) {
      const option = {
        label: this.useForm.get('categoryName').value,
        value: this.useForm.get('parentId').value,
      };

      if (!this.categories.find((item) => item.value === option.value)) {
        this.categories = [option, ...this.categories];
      }
    }
  }

  /**
   * @function create Reroute to create service or create package category
   */
  create(path: 'service' | 'category') {
    this.router.navigate([
      path === 'category'
        ? `/pages/library/packages/${routes.createCategory}`
        : `/pages/library/services/create-service`,
    ]);
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
      ...rest
    } = this.useForm.getRawValue() as PackageFormData;

    if (this.packageId) {
      this.$subscription.add(
        this.packagesService
          .updateLibraryItem<Partial<PackageData>, PackageResponse>(
            this.hotelId,
            this.packageId,
            {
              ...rest,
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
          .createLibraryItem<PackageData, PackageResponse>(this.hotelId, {
            ...rest,
            type: 'PACKAGE',
            source: 1,
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    }
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
    this.router.navigate(['/pages/library/packages']);
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
