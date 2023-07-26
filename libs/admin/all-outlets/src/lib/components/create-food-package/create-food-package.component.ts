import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
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

  types: Option[] = [
    { label: 'Veg', value: 'VEG' },
    { label: 'Non-veg', value: 'NONVEG' },
    { label: 'Drinks', value: 'DRINKS' },
    { label: 'Desserts', value: 'DESSERTS' },
  ];
  foodCategories: Option[] = [
    { label: 'Category 1', value: 'CATEGORY1' },
    { label: 'Category 2', value: 'CATEGORY2' },
    { label: 'Category 3', value: 'CATEGORY3' },
  ];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    route: ActivatedRoute,
    router: Router,
    private taxService: TaxService,
    private outletService: OutletService,
    private pageReloadService: PageReloadService
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

    let data = {
      ...(this.useForm.getRawValue() as FoodPackageForm),
      type: 'FOOD_PACKAGE',
    };

    if (this.foodPackageId) {
      data = { ...data, id: this.foodPackageId };
      this.$subscription.add(
        this.outletService
          .updateFoodPackage(this.foodPackageId, data)
          .subscribe(this.handleSuccess, this.handleErrors)
      );
    } else {
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

  handleSave() {}

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
