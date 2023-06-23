import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { errorMessages } from '../../constants/form';
import { outletRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';
import { FoodPackageForm } from '../../types/outlet';

@Component({
  selector: 'hospitality-bot-create-food-package',
  templateUrl: './create-food-package.component.html',
  styleUrls: ['./create-food-package.component.scss'],
})
export class CreateFoodPackageComponent implements OnInit {
  readonly inputValidationProps = { errorMessages, type: 'number' };

  useForm: FormGroup;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';
  packageId: string = '';
  $subscription = new Subscription();
  loading: boolean = false;

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
    private route: ActivatedRoute,
    private outletService: OutletService
  ) {
    this.packageId = this.route.snapshot.paramMap.get('id');

    const { navRoutes, title } = outletRoutes['createFoodPackage1'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
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
    });

    if (this.packageId) {
      this.$subscription.add(
        this.outletService
          .getFoodPackageById(this.packageId)
          .subscribe((res) => {
            this.useForm.patchValue(res);
          })
      );
    }
  }

  handleCreate() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }

    const data = this.useForm.getRawValue() as FoodPackageForm;

    if (this.packageId) {
      this.$subscription.add(
        this.outletService
          .updateFoodPackage(this.packageId, data)
          .subscribe(this.handleErrors, this.handleSuccess)
      );
    } else {
      this.$subscription.add(
        this.outletService
          .addFoodPackage(data)
          .subscribe(this.handleErrors, this.handleSuccess)
      );
    }
  }

  handleErrors = ({ error }) => {
    this.loading = false;
  };

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `FoodPackage is ${!this.packageId ? 'created' : 'updated'} successfully`,
      '',
      { panelClass: 'success' }
    );
  };

  /**
   * @function handleReset
   * @description resets the form
   */
  handleReset() {
    this.useForm.reset();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
