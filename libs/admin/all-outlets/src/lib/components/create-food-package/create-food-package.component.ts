import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  ModuleNames,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { errorMessages } from '../../constants/form';
import { OutletService } from '../../services/outlet.service';
import { FoodPackageForm } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';
import { TaxService } from 'libs/admin/tax/src/lib/services/tax.service';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { foodPackageFields } from '../../constants/data';
import { PageReloadService } from '../../services/page-reload.service.service';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

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
  foodItemValues = [];
  foodItemIds = [];

  foodCategories: Option[];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    route: ActivatedRoute,
    router: Router,
    private taxService: TaxService,
    private outletService: OutletService,
    private pageReloadService: PageReloadService,
    protected routesConfigService: RoutesConfigService
  ) {
    super(router, route , routesConfigService);
  }

  ngOnInit(): void {
    this.pageReloadService.enablePageReloadConfirmation();
    this.initRoutes('foodPackage');
    this.fields = foodPackageFields;
    this.initForm();
    this.getTax();
    this.getFoodPackageCategory();
  }

  initForm(): void {
    this.foodItemsArray = this.fb.array([]);

    this.useForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      parentId: ['', Validators.required],
      rate: ['', Validators.required],
      currency: ['INR', [Validators.required]],
      discountType: ['PERCENTAGE'],
      discountValue: ['', Validators.required],
      discountedPrice: ['', { disabled: true }],
      discountedPriceCurrency: ['INR'],
      imageUrl: ['', Validators.required],
      hsnCode: [''],
      taxIds: [[]],
      foodItems: this.foodItemsArray,
      source: [1],
      type: ['FOOD_PACKAGE'],
    });

    if (this.foodPackageId) {
      this.$subscription.add(
        this.outletService
          .getFoodPackageById(this.outletId, this.foodPackageId, {
            params: '?type=FOOD_PACKAGE',
          })
          .subscribe((res) => {
            const { taxes, foodItems, imageUrl, images, ...rest } = res;
            this.useForm.get('imageUrl').setValue(images[0].url);
            // ;
            this.useForm.patchValue({
              ...rest,
              taxIds: taxes.map((item) => item.id),
            });
            this.foodItemIds = foodItems.map((item) => item.id);

            this.foodItemValues = foodItems;
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

    let { imageUrl, foodItems, ...rest } = this.useForm.getRawValue();
    let data = { images: [{ isFeatured: true, url: imageUrl }], ...rest };

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

  /**
   * @function getTax to get tax options
   * @returns void
   */
  getTax() {
    this.$subscription.add(
      this.taxService
        .getTaxList(this.outletId, { params: `?entityId=${this.outletId}` })
        .subscribe(({ records }) => {
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

  getFoodPackageCategory() {
    this.outletService
      .getFoodPackageCategory(this.outletId)
      .subscribe((res) => {
        this.foodCategories = res?.records?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      });
  }

  createTax() {
    const dataToSend = {
      entityId: this.outletId, // Replace with your actual data
    };
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TAX,
      additionalPath: 'create-tax',
      queryParams: dataToSend,
    });
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
      replaceUrl: true,
    });
  };

  handleSave() {
    const { foodItems } = this.useForm.getRawValue();
    const activeFoodItemIds = foodItems.map((item) => item.id);
    const removeFoodItemIds = this.foodItemIds.filter(
      (item) => !activeFoodItemIds.includes(item)
    );
    this.$subscription.add(
      this.outletService
        .updateFoodPackage(
          this.outletId,
          this.foodPackageId,

          {
            removeFoodItemIds,
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
