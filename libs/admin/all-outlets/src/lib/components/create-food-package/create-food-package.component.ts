import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BaseDatatableComponent,
  ConfigService,
  NavRouteOptions,
  Option,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { outletRoutes } from '../../constants/routes';
import { errorMessages } from '../../constants/form';

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
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    private tabFilterservice: TableService
  ) {
    const { navRoutes, title } = outletRoutes['createFoodPackage'];
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
  }

  handleReset() {}

  handleCreate() {}
}
