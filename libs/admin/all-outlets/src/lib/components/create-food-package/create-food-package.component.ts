import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { errorMessages } from '../../constants/form';
import { OutletService } from '../../services/outlet.service';
import { OutletBaseComponent } from '../outlet-base.components';
import { TaxService } from 'libs/admin/tax/src/lib/services/tax.service';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { foodPackageFields } from '../../constants/data';
import { PageReloadService } from '../../services/page-reload.service.service';
import { CategoryData, LibraryService } from '@hospitality-bot/admin/library';

@Component({
  selector: 'hospitality-bot-create-food-package',
  templateUrl: './create-food-package.component.html',
  styleUrls: ['./create-food-package.component.scss'],
})
export class CreateFoodPackageComponent extends OutletBaseComponent
  implements OnInit {
  readonly inputValidationProps = { errorMessages, type: 'number' };

  useForm: FormGroup;
  foodItemsArray: FormArray;
  fields: IteratorField[];
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';
  $subscription = new Subscription();

  loading: boolean = false;

  taxes: Option[] = [];
  isPackageCreated = false;

  loadingTypes: boolean = false;
  type: CategoryData['type'] = 'FOOD_PACKAGE_CATEGORY';
  typeOffSet = 0;
  types: Option[] = [];
  noMoreTypes = false;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    route: ActivatedRoute,
    router: Router,
    private taxService: TaxService,
    private outletService: OutletService,
    private pageReloadService: PageReloadService,
    private libraryService: LibraryService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.pageReloadService.enablePageReloadConfirmation();
    this.initRoutes('foodPackage');
    this.fields = foodPackageFields;
    this.initForm();
    this.getTax();
  }

  initForm(): void {
    this.foodItemsArray = this.fb.array([]);

    this.useForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      type: ['', Validators.required],
      originalPrice: ['', Validators.required],
      currency: ['INR'],
      discountType: ['PERCENTAGE'],
      discountValue: ['', Validators.required],
      discountedPrice: ['', { disabled: true }],
      discountedPriceCurrency: ['INR'],
      imageUrl: ['', Validators.required],
      hsnCode: [''],
      taxIds: [[]],
      foodItems: this.foodItemsArray,
      source: [1],
    });

    this.getPackageTypes();

    if (this.foodPackageId) {
      this.$subscription.add(
        this.outletService
          .getFoodPackageById(this.outletId, this.foodPackageId, {
            params: '?type=FOOD_PACKAGE',
          })
          .subscribe((res) => {
            const { taxes, ...rest } = res;
            this.useForm.patchValue({
              ...rest,
              taxIds: taxes.map((item) => item.id),
            });
          })
      );
    }
  }

  onItemsAdded(index: number) {}

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }

    let data = this.useForm.getRawValue();

    if (this.foodPackageId) {
      data = { ...data, id: this.foodPackageId };
      this.$subscription.add(
        this.outletService
          .updateFoodPackage(
            this.outletId,
            this.foodPackageId,
            {
              ...data,
              source: 1,
            },
            {
              params: '?type=FOOD_PACKAGE',
            }
          )
          .subscribe(this.handleSuccess, this.handleErrors)
      );
    } else {
      // const { foodItems, ...rest } = data;
      this.$subscription.add(
        this.outletService
          .addFoodPackage(this.outletId, data)
          .subscribe((res) => {
            this.handleSuccess(res.id);
          }, this.handleErrors)
      );
    }
  }

  getPackageTypes() {
    this.loadingTypes = true;
    this.$subscription.add(
      this.libraryService
        .getCategories(this.outletId, {
          params: `?type=${this.type}&offset=${this.typeOffSet}&limit=10&status=true`,
        })
        .subscribe(
          (res) => {
            const data = res.records.map((type) => ({
              label: type.name,
              value: type.id,
            }));
            this.types = [...this.types, ...data];
            this.noMoreTypes = data.length < 10;
            this.loadingTypes = false;
          },
          (err) => {
            this.loadingTypes = false;
          }
        )
    );
  }

  loadMoreTypes() {
    this.typeOffSet = this.typeOffSet + 10;
    this.getPackageTypes();
  }

  searchTypes(text: string) {
    if (text) {
      this.loadingTypes = true;
      this.libraryService
        .searchLibraryItem(this.outletId, {
          params: `key=${text}&type=${this.type}`,
        })
        .subscribe((res) => {
          this.loadingTypes = false;
          const data = res && res[this.type];
          this.types =
            data?.map((item) => ({
              label: item.name,
              value: item.id,
            })) ?? [];
        });
    } else {
      this.typeOffSet = 0;
      this.types = [];
      this.getPackageTypes();
    }
  }

  create(event) {
    this.$subscription.add(
      this.libraryService
        .createCategory(this.outletId, {
          name: event,
          source: 1,
          imageUrl: '',
          active: true,
          type: this.type,
        })
        .subscribe(
          (res) => {
            this.types.push({
              label: res?.name,
              value: res?.id,
            });
            this.useForm.get('type').setValue(res.id);
          },
          () => {
            this.snackbarService.openSnackBarAsText(
              'Type created successfully',
              '',
              { panelClass: 'success' }
            );
            this.typeOffSet = 0;
            this.types = [];
            this.getPackageTypes();
          }
        )
    );
  }

  /**
   * @function getTax to get tax options
   * @returns void
   */
  getTax() {
    this.$subscription.add(
      this.taxService.getTaxList(this.outletId).subscribe(({ records }) => {
        records = records.filter(
          (item) => item.category === 'service' && item.status
        );
        this.taxes = records.map((item) => ({
          label: item.taxType + ' ' + item.taxValue + '%',
          value: item.id,
        }));
      })
    );
  }

  createTax() {
    this.router.navigate(['pages/settings/tax/create-tax']);
  }

  createType(name: string) {}

  handleErrors = ({ error }) => {
    this.loading = false;
  };

  handleSuccess = (id: string) => {
    this.loading = false;
    this.isPackageCreated = true;
    this.snackbarService.openSnackBarAsText(
      `FoodPackage is ${
        !this.foodPackageId ? 'created' : 'updated'
      } successfully`,
      '',
      { panelClass: 'success' }
    );
    this.pageReloadService.disablePageReloadConfirmation();
    this.router.navigate([id], {
      relativeTo: this.route,
    });
  };

  handleSave() {
    const { foodItems } = this.useForm.getRawValue();
    this.$subscription.add(
      this.outletService
        .updateFoodPackage(
          this.outletId,
          this.foodPackageId,

          {
            foodItems,
            type: 'FOOD_PACKAGE',
            source: 1,
          },
          {
            params: '?type=FOOD_PACKAGE',
          }
        )
        .subscribe(this.handleSuccess, this.handleErrors)
    );
  }

  /**
   * @function handleReset
   * @description resets the form
   */
  handleReset() {
    this.useForm.reset();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
    this.pageReloadService.disablePageReloadConfirmation();
  }
}
