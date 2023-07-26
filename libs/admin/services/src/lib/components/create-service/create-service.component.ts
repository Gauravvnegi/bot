import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  LibraryItem,
  ServiceTypeOptionValue,
} from '@hospitality-bot/admin/library';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { servicesRoutes } from '../../constant/routes';
import { ServicesService } from '../../services/services.service';
import { ServiceResponse } from '../../types/response';
import { ServiceData, ServiceFormData } from '../../types/service';

@Component({
  selector: 'hospitality-bot-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})
export class CreateServiceComponent implements OnInit {
  serviceId: string;
  entityId: string;
  useForm: FormGroup;
  code: string = '# will be auto generated';

  pageTitle: string;
  navRoutes: NavRouteOptions;

  loading = false;
  $subscription = new Subscription();

  /* categories options variable */
  categoryOffSet = 0;
  loadingCategory = false;
  noMoreCategories = false;

  // ** All the dropdown value to be from configuration api **
  types: Option[] = [
    { label: 'Complimentary', value: ServiceTypeOptionValue.COMPLIMENTARY },
    { label: 'Paid', value: ServiceTypeOptionValue.PAID },
  ];
  units: Option[] = [
    { label: 'Km', value: 'Km' },
    { label: 'PERSON', value: 'PERSON' },
    { label: 'TRIP', value: 'TRIP' },
  ];
  categories: Option[] = [];
  currencies: Option[] = [];
  visibilities: Option[] = [];
  tax: Option[] = [];

  isSelectedTypePaid = false;

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private servicesService: ServicesService,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.serviceId = this.route.snapshot.paramMap.get('id');

    /* Setting page title and nav routes */
    const { navRoutes, title } = servicesRoutes[
      this.serviceId ? 'editService' : 'createService'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initOptionsConfig();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useForm = this.fb.group({
      active: [true],
      // currency: [''],
      parentId: ['', Validators.required],
      categoryName: [''],
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      serviceType: ['', Validators.required],
      // rate: [''],
      unit: ['', Validators.required],
      enableVisibility: [[], Validators.required],
      taxIds: [[]],
    });

    this.updateFormControlSubscription();

    /* Patch the form value if service id present */
    if (this.serviceId) {
      this.$subscription.add(
        this.servicesService
          .getLibraryItemById<ServiceResponse>(this.entityId, this.serviceId, {
            params: `?type=${LibraryItem.service}`,
          })
          .subscribe((res) => {
            const { type, taxes, ...rest } = res;
            this.useForm.patchValue({
              serviceType: type,
              ...rest,
              taxIds: taxes.map((item) => item.id),
            });
            this.code = res.packageCode;
          }, this.handleError)
      );
    }
  }

  /**
   * @function updateFormControlSubscription  Add and remove FormControl Based on service type selection
   */
  updateFormControlSubscription() {
    this.useForm.get('serviceType').valueChanges.subscribe((res) => {
      this.isSelectedTypePaid = res === this.types[1].value;
      if (this.isSelectedTypePaid) {
        this.useForm.addControl(
          'rate',
          new FormControl('', Validators.required)
        );
        this.useForm.addControl(
          'currency',
          new FormControl('', [Validators.required, Validators.min(1)])
        );
      } else {
        this.useForm.removeControl('rate');
        this.useForm.removeControl('currency');
      }
    });
  }

  /**
   * @function initOptionsConfig To get all the dropdown options
   */
  initOptionsConfig() {
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { currencyConfiguration, packageVisibility } = value;
        this.currencies = currencyConfiguration.map(({ key, value }) => ({
          label: key,
          value,
        }));
        this.visibilities = packageVisibility.map(({ key, value }) => ({
          label: value,
          value: key,
        }));
      }
    });

    this.getTax();
  }
  /**
   * @function getTax to get tax options
   * @returns void
   */
  getTax() {
    this.$subscription.add(
      this.servicesService
        .getTaxList(this.entityId)
        .subscribe(({ records }) => {
          records = records.filter(
            (item) => item.category === 'service' && item.status
          );
          this.tax = records.map((item) => ({
            label: item.taxType + ' ' + item.taxValue + '%',
            value: item.id,
          }));
        })
    );
  }
  /**
   * @function createCategory
   */
  createCategory() {
    this.router.navigate([
      `/pages/library/services/${servicesRoutes.createCategory.route}`,
    ]);
  }

  /**
   * @function handleSubmit Handle form data submission
   */
  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.useForm.getRawValue() as ServiceFormData;
    if (this.serviceId) {
      this.$subscription.add(
        // ** refactor ** patch not working
        this.servicesService
          .updateLibraryItem<Partial<ServiceData>, ServiceResponse>(
            this.entityId,
            this.serviceId,
            data,
            { params: '?type=SERVICE' }
          )

          .subscribe(this.handleSuccess, this.handleError)
      );
    } else {
      this.$subscription.add(
        this.servicesService
          .createLibraryItem<ServiceData, ServiceResponse>(this.entityId, {
            ...data,
            type: 'SERVICE',
            source: 1,
          })
          .subscribe(this.handleSuccess, this.handleError)
      );
    }
  }

  createTax() {
    this.router.navigate(['pages/settings/tax/create-tax']);
  }

  handleSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `Service ${this.serviceId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.router.navigate(['/pages/library/services']);
  };

  closeLoading = () => {
    this.loadingCategory = false;
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }

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
